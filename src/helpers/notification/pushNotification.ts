import { Expo } from 'expo-server-sdk';
import { AlarmManager } from '../../data-manager/alarm.manager';
import { LoginManager } from '../../data-manager/login.manager';
import { AlarmController } from '../../controllers/alarm.controller';

export class PushNotification {
    public fetchAlertMsg = async (sen_id: any, alarmStatus: any) => {
        let alarmManager = new AlarmManager();
        let messagesList = [];
        let pushNotificationTempId = alarmStatus === "1" ? 2 : 4;
        let alarmMessages: any = await alarmManager.getAlarmMessage(pushNotificationTempId, sen_id);
        if (alarmMessages && alarmMessages.length > 0) {
            alarmMessages.forEach(alaramMsgObj => {
                let apartId = alaramMsgObj.apartId;
                let flat = alaramMsgObj.flat;
                let block = alaramMsgObj.block;
                let place = alaramMsgObj.cust_name;
                let title = alaramMsgObj.title;
                let message = alaramMsgObj.message;
                let finalmessage = message.replace("|param|", place);
                let alarmType = 12; // Leakage Alarm Type
                let compId = alaramMsgObj.compId;
                this.addAlarmHistory(apartId, compId, alarmType, alarmStatus);
                let loginManager = new LoginManager();
                (async () => {
                    let sessionList: any = await loginManager.getUserSessionList(apartId);
                    if (sessionList && sessionList.length > 0) {
                        sessionList.forEach(sessionObj => {
                            if (sessionObj.pushToken && Expo.isExpoPushToken(sessionObj.pushToken)) {
                                let messageObj: any = {
                                    "to": sessionObj.pushToken,
                                    "sound": "default",
                                    "body": finalmessage,
                                    "data": {
                                        "apartId": apartId,
                                        "flat": flat,
                                        "block": block,
                                        "title": title,
                                        "message": finalmessage
                                    }
                                }
                                this.sendPushNotification([messageObj]);
                           }
                        });
                    }
                })();
            });
        }
    }

    public sendPushNotification(messageList) {
      let expo = new Expo();
        let chunks = expo.chunkPushNotifications(messageList);
        let tickets = [];
        (async () => {
          for (let chunk of chunks) {
            try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              console.log(JSON.stringify(ticketChunk));
              tickets.push(...ticketChunk);
            } catch (error) {
             // console.log(JSON.stringify(error));
            }
          }
        })();
    }

    public addAlarmHistory(apartId, compId, alarmType, alarmStatus) {
      let alarmObj = {
        'apartId': apartId,
        'compId' : compId,
        'alarmType': alarmType,
        'status': alarmStatus,
        'activeAlarm': alarmStatus
      }
      let alarmController = new AlarmController();
      alarmController.addAlarmHistory(alarmObj);
    }

    public push(message: Object, pushTokens: Array<string>) {
        pushTokens = ['ExponentPushToken[gO2LiwIzZrTpPi6pC_7mod]']
        console.log("push triggered");
        let expo = new Expo();
        let messages = [];
        for (let pushToken of pushTokens) {
          if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
          }
          messages.push({
            to: pushToken,
            sound: 'default',
            body: 'This is an Alarm Notification',
            data: { withSome: 'data' },
          })
        }
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
          for (let chunk of chunks) {
            try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              console.log(ticketChunk);
              tickets.push(...ticketChunk);
            } catch (error) {
              console.error(error);
            }
          }
        })();
    }
}

