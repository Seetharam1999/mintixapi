import { Router, Request, Response, NextFunction } from 'express';
import { Api } from './../helpers';
import { AlarmManager } from '../data-manager/alarm.manager';
import { Helper } from '../helpers/helper';
import { PushNotification } from '../helpers/notification/pushNotification.config';
import { ValidatorHelper } from '../helpers/validate';
import { ValidatorSchema } from '../validator-schema/schema';
import { orderBy } from 'lodash';

export class AlarmController {
    public static route = '/alarms';
    public router: Router = Router();
    constructor() {
        this.router.post('/', this.getAlarms);
        this.router.get('/send', this.dummyPush);
    }

    // getting the last 7 days alarm data for an aparment id
    public getAlarms = async (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.alarms(), request.body).then(async () => {
            let alarmManager = new AlarmManager();
            let date = new Date();
            let toDate = date.toISOString().split('T')[0];
            let fromDate = new Date(date.setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
            let input = request.body;
            try {
                let alarmHistory = await alarmManager.getAlarmHistory(input["apart_id"], toDate, fromDate);
                Api.ok(request, response, this.formatAlarm(alarmHistory));
            } catch (error) {
                Api.serverError(request, response, error);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    // method to format alarm data by adding start and end time.
    public formatAlarm(data) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i]["state"] === 1) {
                let end = data.find((o) => o.state === 0 && o["component_id"] === data[i]["component_id"]);
                if (end) {
                    data[i]["end_date"] = end["start_date"];
                    data[i]["alarm_type"] = Helper.getAlarmType(data[i]["alarm_type"]);
                    result.push(data[i]);
                    end["component_id"] = null;
                }
            } else {
                     data[i]["state"] = null
            }
        }
        return orderBy(result, ['start_date'], ['desc']);
    }

    public dummyPush(request: Request, response: Response, next: NextFunction) {
        new PushNotification().push('Hello', ['token']);
        Api.ok(request, response, "Push Triggered");
    }

    public addAlarmHistory (reqObj) {
        let alarmManager = new AlarmManager();
        let resp = alarmManager.insertAlarmHistory(reqObj);
        if (reqObj.activeAlarm === "0") {
            this.resetAlarm(reqObj);
        }
    }

    public resetAlarm (reqObj) {
        let alarmManager = new AlarmManager();
        let resp = alarmManager.resetAlarm(reqObj);
    }
}
