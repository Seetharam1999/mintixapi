import { Router, Request, Response, NextFunction } from 'express';
import { Api } from './../helpers';
import { BillingManager } from '../data-manager/billing.manager';
import { ValidatorHelper } from '../helpers/validate';
import { ValidatorSchema } from '../validator-schema/schema';
import { array } from 'joi';
import * as moment from 'moment';
import { indexOf, map, sortBy } from 'lodash';

export class BillingController {
    public static route = '/billing';
    public router: Router = Router();
    constructor() {
        this.router.post('/', this.getBillingDetails);
        this.router.post('/history', this.getBillingHistory);
    }

    public getBillingHistory = async (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.billingHistory(), request.body).then(async () => {
            let billingManager = new BillingManager();
            let inputParams = request.body;
            try {
                let invoice: any = await billingManager.getBillingHistory(inputParams["apart_id"],
                inputParams["site_id"], inputParams["limit"], inputParams["skip"]);
                Api.ok(request, response, invoice);
            } catch (error) {
                Api.ok(request, response, error);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    // get the billing details for the last 6 months with estimate at the last
    public getBillingDetails = async (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.billing(), request.body).then(async () => {
            let billingManager = new BillingManager();
            let date = new Date();
            let inputParams = request.body;
            let currentMonth = date.getMonth() + 1;
            let currentYear = date.getFullYear();
            let numberOfHistory: Number = 6;
            let months = this.getLastGivenMonths(currentMonth, currentYear, numberOfHistory);
            try {
                let invoice: any = await billingManager.getBilling(inputParams["apart_id"], inputParams["site_id"], months);
                invoice = invoice ? invoice : [];
                let currentMonthUsage: any = [];
                let estimate: any = [];
                // if (invoice.length > 0) {
                    currentMonthUsage = await billingManager.getCurrentMonthUsage(inputParams["apart_id"],
                    currentMonth, currentYear);
                    if (currentMonthUsage.length > 0) {
                        estimate = await billingManager.getEstimate(inputParams["site_id"],
                        currentMonthUsage[currentMonthUsage.length - 1]["inlet_usage"]);
                    }
                // }
                invoice = this.getInletSplitUp(invoice, numberOfHistory);
                let currentMonthInvoice: any = this.getCurrentMonthInvoice(invoice,
                    currentMonthUsage, estimate, currentMonth, currentYear);
                invoice = sortBy(invoice, [ function(o) { return o.index; } ]);
                invoice.push(currentMonthInvoice);
                invoice = sortBy(invoice, [ function(o) { return o.index; } ]);
                Api.ok(request, response, invoice);
            } catch (error) {
                Api.ok(request, response, error);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    // setting the current month invoice using the previous month invoice details. To be changed after exact data
    public getCurrentMonthInvoice = function(invoice, currentMonthUsage, estimate, currentMonth, currentYear) {
        let currentMonthInvoice = {
            "rental_component_charges": invoice ? invoice[0]["rental_component_charges"] : 0,
            "service_fees": invoice ? invoice[0]["service_fees"] : 0,
            "venaqua_amc": invoice ? invoice[0]["venaqua_amc"] : 0,
            "cur_mon_cost": estimate.length > 0 ? estimate[0]["estimate"] : 0,
            "cur_mon_usage": currentMonthUsage.length > 0 ? currentMonthUsage[currentMonthUsage.length - 1]["inlet_usage"] : 0,
            "year": currentYear || 0,
            "inlet_data": currentMonthUsage.length > 0 ? currentMonthUsage : [],
            "bill_month": "",
            "bill_from": "",
            "bill_to": "",
            "due_date": "",
            "tax": invoice ? invoice[0]["tax"] : 0,
            "billed_date": "",
            "site_id": invoice ? invoice[0]["site_id"] : 0,
            "apart_id": invoice ? invoice[0]["apart_id"] : 0,
            "month_select": currentMonth,
            "index": 0
        };
        currentMonthInvoice["total"] = currentMonthInvoice["rental_component_charges"] || 0
                                       + currentMonthInvoice["service_fees"]  || 0
                                       + currentMonthInvoice["venaqua_amc"]  || 0
                                       + currentMonthInvoice["cur_mon_cost"]  || 0;
        if (currentMonthUsage.length > 0) {
            currentMonthUsage.splice(-1, 1);
        }
        return currentMonthInvoice;
    }

    // creating the string for previous 6 months as dynamic query
    public getLastGivenMonths =  (currentMonth, currentYear, months) => {
        let arr = [];
        for (let i = 0; i <= months - 1; i++) {
            if (currentMonth === 0) {
                currentMonth = 12;
                currentYear--;
            }
            arr.push(`(${currentYear}, ${currentMonth})`)
            currentMonth--;
        }

        return arr.join(',');
    }


    // create the inlet wise data for billing
    public getInletSplitUp = (invoice, numberOfInvoiceHistory) => {
        let startDate = moment(new Date());
        for (let index = 1; index <= numberOfInvoiceHistory; index++) {
            let endDate = moment().subtract(index, "months");
            let monthStr: string = endDate.format('MMM-YYYY').toString();
            let billMonthArr: any  = invoice ? map (invoice, "bill_month") : [];
            let invoiceIndex = indexOf(billMonthArr, monthStr);
            if (invoiceIndex > -1) {
                let inlet = invoice[invoiceIndex]["inlet"].split(',');
                let inlet_usage = invoice[invoiceIndex]["inlet_usage"].split(',');
                let inlet_data = [];
                for (let k = 0; k < inlet.length; k++) {
                    let temp = {};
                    temp["inlet_name"] = inlet[k] || '-';
                    temp["inlet_usage"] = inlet_usage[k] || 0;
                    inlet_data.push(temp);
                }
                invoice[invoiceIndex]["inlet_data"] = inlet_data;
                invoice[invoiceIndex]["index"] = index;
                delete invoice[invoiceIndex]["inlet"];
                delete invoice[invoiceIndex]["inlet_usage"];
            } else {
                let dummyInvoice = {
                    "index": index,
                    "inv_no": null,
                    "rental_component_charges": 0,
                    "service_fees": 0,
                    "venaqua_amc": 0,
                    "cur_mon_cost": 0,
                    "cur_mon_usage": 0,
                    "year": endDate.year(),
                    "inlet_data": [],
                    "bill_month": monthStr,
                    "bill_from": "",
                    "bill_to": "",
                    "due_date": "",
                    "tax": 0,
                    "billed_date": "",
                    "site_id": 0,
                    "apart_id": 0,
                    "month_select": endDate.month()
                };
                invoice.push(dummyInvoice);
            }
        }
        return invoice;
    }
}
