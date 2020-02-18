import { AppSetting } from '../../config';
import * as mqtt from 'mqtt';
import { Expo } from 'expo-server-sdk';

export class PushNotification {
    private client: mqtt.MqttClient;
    public subscribe() {
        const path = AppSetting.getConfig().PushNotification().subscribePath;
        this.client  = mqtt.connect('mqtt://test.mosquitto.org');
        this.client.on('connect', () => {
            this.client.subscribe(path, function (err) {
              if (!err) {
                // console.log("Mqtt connection established");
              }
            });
          });
    }

    public listen() {
        this.client.on('message', function (topic, message) {
            // message is Buffer
            console.log(message.toString());
            this.push();
          })
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

