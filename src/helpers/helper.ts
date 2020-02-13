import * as passwordHash from 'password-hash';
import * as JsonWebToken from 'jsonwebtoken';
import { jwt } from './../config/jwt.secret';
import * as request from 'request';

export class Helper {
    public static hashPassword(password: string) {
        return passwordHash.generate(password);
    }
    public static verifyHashPassword(password: string, hashedPassword: string) {
        return passwordHash.verify(password, hashedPassword);
    }

    public static replaceSMSContent(str, delimiter, replaceArr) {
        let strArr = str.split(delimiter);
        let finalStr = "";
        for (let index = 0; index <= strArr.length; index++) {
            if (strArr[index]) {
                finalStr += strArr[index] + ' ' + replaceArr[index];
            }
            if (index >= strArr.length) {
                return finalStr;
            }
        }
    }

    public static generateOTP() {
        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++ ) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    public static verifyJwtToken(token: string) {
        return JsonWebToken.verify(token, jwt.secret, (err, decoded) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log(decoded)
                return decoded;
            }
          });
    }
      // setting the alarm type
    public static getAlarmType = (alarmType) => {
        let alarmDesc;
        if (alarmType === 1 || alarmType === 12) {
            return "leakage";
        } else if (alarmType === 2) {
            return "abnormal";
        } else if (alarmType === 10 || alarmType === 11 || alarmType === 5 ) {
            return "signallost";
        } else {
            return "normal";
        }
    }

    public static sendHttpPostReq(url, reqPayload) {
        return new Promise((resolve, reject) => {
            request.post(url, { json: reqPayload }, (err, res, body) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(body);
                 }
            });
        });
    }

}
