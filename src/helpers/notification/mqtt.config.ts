import { AppSetting } from '../../config';
import * as mqtt from 'mqtt';
import { Helper } from '../../helpers';

export class MqttConfig {
    private client: mqtt.MqttClient;
    public subscribe() {
        const subscribePath = AppSetting.getConfig().PushNotification().subscribePath;
        const mqttURL = AppSetting.getConfig().PushNotification().mqttUrl;
        this.client = mqtt.connect(mqttURL);
        this.client.on('connect', () => {
            // this.client.subscribe(subscribePath, function (err) {
            //     if (!err) {
            //         console.log("Mqtt connection established");
            //     } else {
            //         console.log(err);
            //     }
            // });
            // this.client.subscribe('FA/LE/#');
             //this.client.subscribe('FA/BU/#');
            // this.client.subscribe('FA/NF/#');
            // this.client.subscribe('FA/CE/#');
            // this.client.subscribe('FA/SF/#');
            // this.publishMessage();
        });
    }

    public listen() {
        this.client.on('message', (topic, message: any, packet) => {
            // topic = "Test/Apna/FA/CE/AGA280918002/ASE071803625";
            // message = "0"; // 1 - Leakage 0 - Leakage fixed
            let alarmStatus = message.toString() === "1" ? "ON" : "OFF";
            let receivedTopic: any = topic.split('/');
            let compId = receivedTopic[3];
            let alarmType = receivedTopic[1];
            this.formHttpReq(alarmStatus, alarmType, compId);
        })
    }

    public formHttpReq(status, type, compId) {
        let alarmType = type + "-" + status;
        let component = compId;
        let alarmStatus = status === "ON" ? "1" : "0";
        let notifyTo = [];
        let notifyType = [];
        switch (type) {
            case 'LE':
                notifyTo = ["SITE_ADMIN", "USER"];
                notifyType = [
                    {
                        "type": "EMAIL",
                        "templateId": status === "ON" ? "2" : "7"
                    },
                    {
                        "type": "SMS",
                        "templateId": status === "ON" ? "2" : "7"
                    },
                    {
                        "type": "PN",
                        "templateId": status === "ON" ? "2" : "4"
                    }
                ]
                break;
            case 'BU':
                notifyTo = ["SITE_ADMIN", "USER"];
                notifyType = [
                    {
                        "type": "EMAIL",
                        "templateId": status === "ON" ? "5" : "9"
                    },
                    {
                        "type": "SMS",
                        "templateId": status === "ON" ? "5" : "9"
                    },
                    {
                        "type": "PN",
                        "templateId": status === "ON" ? "5" : "6"
                    }
                ]
                break;
            case 'CE':
                notifyTo = ["SUPPORT_ADMIN", "SITE_ADMIN", "USER"];
                notifyType = [
                    {
                        "type": "EMAIL",
                        "templateId": status === "ON" ? "11" : "12"
                    }
                ]
                break;
            case 'NF':
                notifyTo = ["SUPPORT_ADMIN", "SITE_ADMIN", "USER"];
                notifyType = [
                    {
                        "type": "EMAIL",
                        "templateId": "10"
                    }
                ]
                break;
        }
        let reqPayload = {
            "alarmType": alarmType,
            "component": component,
            "alarmStatus": alarmStatus,
            "notifyTo": notifyTo,
            "notifyType": notifyType
        }
        console.log(reqPayload);
        let notificationBaseURL = AppSetting.getConfig().microServiceConfig().notificationBaseURL;
        Helper.sendHttpPostReq(notificationBaseURL + '/alarm/trigger', reqPayload);
    }

    public publishMessage() {
        this.client.publish("FA/LE/", "1");
    }

}

