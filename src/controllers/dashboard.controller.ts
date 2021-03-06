import { Router, Request, Response, NextFunction } from 'express';
import { Api } from './../helpers';
import { DashboardManager } from '../data-manager/dashboard.manager';
import { Helper } from '../helpers/helper';
import { ValidatorHelper } from '../helpers/validate';
import { ValidatorSchema } from '../validator-schema/schema';
import * as moment from 'moment';
import { map, groupBy } from 'lodash';

export class DashboardController {
    public static route = '/dashboard';
    public router: Router = Router();
    constructor() {
        this.router.post('/', this.getUsage);
        this.router.post('/trending', this.getTrendsData);
    }

    public getTrendsData = async (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.trendingReport(), request.body).then(async () => {
            let dashboardManager = new DashboardManager();
            let apartId = request.body.apart_id;
            let siteId = request.body.site_id;
            let blockId = request.body.block_id;
            let fromDate = request.body.from_date;
            let toDate = request.body.to_date;
            let usageArr: any;
            let finalResp = [];
            try {
                usageArr =  await dashboardManager.getApartmentCompDayUsage(apartId, fromDate, toDate);
                console.log(usageArr);
                let compArr: any = await dashboardManager.getComponentList(apartId);
                compArr.unshift({'cust_name': "Total", "icon": ''});
                let dayArr: any = await this.formDayArrList (compArr, fromDate, toDate);
                let resp: any = await this.formTrendingData(dayArr, usageArr);
                let formResp: any = groupBy(resp, "seriesName");
                Object.keys(formResp).forEach(e => {
                    let data = formResp[e];
                    let finalObj = {
                        "seriesName": e,
                        "seriesIcon": data[0]['seriesIcon'] ? data[0]['seriesIcon'] : "",
                        "data": data
                    }
                    finalResp.push(finalObj);
                });
                return Api.ok(request, response, finalResp);
            } catch (error) {
                return Api.serverError(request, response, error);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

     // To form day array list
     private formDayArrList (compArr, fromDate: string, toDate: string) {
        let startDate = moment(fromDate).format("YYYY-MM-DD");
        let endDate = moment(toDate).format("YYYY-MM-DD");
        let dayDiff: number = moment(endDate).diff(moment(startDate), 'days');
        let dayArr = [];
        try {
           compArr.forEach(compObj => {
              for (let dayIndex = 0; dayIndex <= dayDiff; dayIndex++) {
                    let newDate = moment(startDate).add(dayIndex, "days").format("YYYY-MM-DD");
                    if (dayIndex === 0) {
                        let initialObj = {
                            x: startDate,
                            y: 0,
                            seriesName: compObj["cust_name"] ? compObj["cust_name"] : "",
                            seriesIcon: compObj["icon"] ? compObj["icon"] : ""
                        }
                        dayArr.push(initialObj);
                    } else {
                        let dayObj = {
                            x: newDate,
                            y: 0,
                            seriesName: compObj["cust_name"] ? compObj["cust_name"] : "",
                            seriesIcon: compObj["icon"] ? compObj["icon"] : ""
                        }
                        dayArr.push(dayObj);
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
        return dayArr;
    }

    private formTrendingData (responseArr = [], compUsageArr) {
        try {
            let updateDateArr = compUsageArr ?  map(compUsageArr, function(o) { return o.last_updated_date + '-' + o.cust_name; }) : [];
            let totalDateArr = map(responseArr, (o) => {
                if (o.seriesName === "Total") {
                    return "Total-" + o.x;
                } else {
                    return o.x;
                }
            });
            responseArr.forEach(respObj => {
                let compUsageIndex = updateDateArr.indexOf(respObj["x"] + '-' + respObj["seriesName"]);
                if (compUsageIndex > -1) {
                    let copName: string = compUsageArr[compUsageIndex]["cust_name"];
                    let yLabel: string = respObj["seriesName"];
                    if (copName.toLowerCase() === yLabel.toLowerCase()) {
                        respObj["y"] = compUsageArr[compUsageIndex]["day_total"];
                        updateDateArr[compUsageIndex] = "done";
                        let totalIndex = totalDateArr.indexOf("Total-" + respObj["x"]);
                        if (totalIndex > -1) {
                            responseArr[totalIndex]["y"] += compUsageArr[compUsageIndex]["day_total"];
                        }

                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
        return responseArr;
    }

    // get the usage for the given from and to date
    public getUsage = async (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.dashboard(), request.body).then(async () => {
            let inputParams = request.body;
            let fromDate = request.body.from_date;
            let startDate = moment(fromDate).format("YYYY-MM-DD");
            let days7=moment(startDate).subtract(7,'d').format("YYYY-MM-DD").toString();
                let days2=moment(startDate).subtract(2,'d').format("YYYY-MM-DD").toString();
                let month=moment(startDate).subtract(1,'months').format("YYY-MM-DD").toString().substr(2);
           
                     let toDate = request.body.to_date.toString();
            //console.log(fromDate,toDate);
            let dashboardManager = new DashboardManager();
            let result;
            try {
                let usage: any = await dashboardManager.getUsage(fromDate,
                    toDate, inputParams["apart_id"]);
                    let usage2: any = await dashboardManager.getUsage(days2,
                        toDate, inputParams["apart_id"]);
                        let usage7: any = await dashboardManager.getUsage(days7,
                            toDate, inputParams["apart_id"]);
                            let usage1month: any = await dashboardManager.getUsage(month,
                                toDate, inputParams["apart_id"]);
                        
                    // console.log("usage : ")
                  //console.log(usage);
                if (usage.length) {
                    result = this.formatDashboard(inputParams, usage,usage2,usage7,usage1month);
                    console.log(result);
                }
                return Api.ok(request, response, result);

            } catch (error) {
                return Api.serverError(request, response, error);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }


    // format the date according the the required structure
    public formatDashboard = (inputParams, data,data2,data7,dataM) => {
        let result = {};
        result["site_id"] = inputParams["site_id"];
        result["block_id"] = inputParams["block_id"];
        result["apart_id"] = inputParams["apart_id"];
        result["block_status"] = data[0]["block_status"] ? data[0]["block_status"] : 0;
        result["min_data"] = [];
        for (let i in data) {
            if (data[i] != null) {
                let temp = {};
                temp["min_name"] = data[i]["cust_name"];
                temp["min_usage"] = data[i]["day_total"];
                temp["min_icon"] = data[i]["icon"];
                temp["min_usage_2days"]=data2[i]["day_total"];
                temp["min_usage_7days"]=data7[i]["day_total"];
                temp["min_usage_month"]=dataM[i]["day_total"];
                temp["last_updated_date"] = data[i]["last_updated_date"];
                temp["component_id"] = data[i]["component_id"]
                temp["min_alarm_type"] = data[i]["activeAlarm"] === 0 ? "normal" : Helper.getAlarmType(data[i]["alarm_type"]);
                result["min_data"].push(temp);
            }
        }
        return result;
    }

    // setting the alarm type
    public getAlarmType = (alarmType) => {
        let alarmDesc;
        if (alarmType === 1 || alarmType === 12) {
            return "leakage";
        } else if (alarmType === 2) {
            return "abnormal";
        } else if (alarmType === 10 || alarmType === 11 || alarmType === 5) {
            return "signallost";
        } else {
            return "normal";
        }
    }
}
