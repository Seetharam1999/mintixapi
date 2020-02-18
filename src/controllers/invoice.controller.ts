import { Router, Request, Response, NextFunction } from 'express';
import { Api } from './../helpers';
import { BillingManager } from '../data-manager/billing.manager';
import { ValidatorHelper } from '../helpers/validate';
import { ValidatorSchema } from '../validator-schema/schema';
import { array } from 'joi';
import * as moment from 'moment';
import * as azure from 'azure-storage';
import { Config } from './../config/config';
import { BaseConfig } from './../config/index';
export class InvoiceController {
    public static route = '/invoice';
    public router: Router = Router();
    private baseConfig: BaseConfig = Config.getConfig();
    constructor() {
        this.router.get('/downloadInvoice', this.dowloadInvoice);
    }

    public dowloadInvoice = async (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.downloadInvoice(), request.query).then(async () => {
            let inputParams = request.query;
            let Key = this.baseConfig.azureStorage().key;
            let storageAccount = this.baseConfig.azureStorage().storageAccount;
            try {
                let siteId = inputParams.site_id;
                let siteName = inputParams.site_name + '-test';
                let block_name = inputParams.block_name;
                let cust_name = inputParams.cust_name;
                let invoiceMonth = inputParams.invoice_month;
                let invoiceYear = inputParams.invoice_year;
                let month = invoiceMonth;
                let year = invoiceYear;
                const startDate = moment([year, month - 1, 1]).format('YYYY-MM-DD');
                const daysInMonth = moment(startDate).daysInMonth();
                const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD');
                let bill_month = moment(startDate).format('MMM-YYYY');
                let blobService = azure.createBlobService(storageAccount, Key);
                let containerName = siteName.toLowerCase().replace(" ", "-");
                let blobName = cust_name + block_name + '.pdf';
                let filename = 'D:\\' + blobName;
                blobService.getBlobToLocalFile(containerName,
                    bill_month + '/' + cust_name + block_name + '.pdf', 'D:\\'
                    + cust_name + block_name + '.pdf', function (error, result, resp) {
                    if (!error) {
                        response.sendFile(filename);
                    } else {
                        Api.badRequest(request, response, error);
                    }
                });
            } catch (error) {
                Api.ok(request, response, error);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }
}
