import { Router, Request, Response, NextFunction } from 'express';
import { Api } from '../helpers';
import { LoginManager } from '../data-manager/login.manager';
import { ValidatorHelper } from '../helpers/validate';
import { ValidatorSchema } from '../validator-schema/schema';
import { join } from 'lodash';
import { Expo } from 'expo-server-sdk';
import { PushNotification } from '../helpers/notification/pushNotification';

export class NotificationController {
    public static route = '/notification';
    public router: Router = Router();
    constructor() {
        this.router.post('/generateInvoice', this.generateInvoiceNotify);
    }

    public generateInvoiceNotify = async(request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.generateInvoiceNotify(), request.body).then(async () => {
            let apartIdArr = request.body.apartId;
            let message = request.body.message;
            let loginManager = new LoginManager();
            let sessionList: any = await loginManager.getSessionListUsingApart(join( apartIdArr, ',' ));
            if (sessionList && sessionList.length > 0) {
                sessionList.forEach(sessionObj => {
                    if (sessionObj.pushToken && Expo.isExpoPushToken(sessionObj.pushToken)) {
                        let messageObj: any = {
                            "to": sessionObj.pushToken,
                            "sound": "default",
                            "body": message,
                            "data": {}
                        }
                        let pushNotification = new PushNotification();
                        pushNotification.sendPushNotification([messageObj]);
                   }
                });
                let resp = {"response": "Invoice notification initiated successfully"};
                Api.ok(request, response, resp);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }
}
