 import { Router, Request, Response, NextFunction } from 'express';
import { Api, Helper } from './../helpers';
import { LoginManager } from './../data-manager/login.manager';
import { Config } from './../config/config';
import { BaseConfig } from './../config/index';
import { ValidatorHelper } from '../helpers/validate';
import { ValidatorSchema } from '../validator-schema/schema';
import * as JsonWebToken from 'jsonwebtoken';
import { jwt } from '../config/jwt.secret';

export class LoginController {
    public static route = '/session';
    public router: Router = Router();
    private baseConfig: BaseConfig = Config.getConfig();
    constructor() {
        this.router.post('/login', this.login);
        this.router.post('/refresh', this.refresh);
        this.router.post('/logout', this.logout);
        this.router.post('/verifyUser', this.verifyUser);
        this.router.post('/verifyOTP', this.verifyOTP);
        this.router.post('/register', this.register);
        this.router.post('/changePassword', this.changePassword);
        this.router.post('/updateDeviceInfo', this.updateDeviceInfo);
    }

    public changePassword = async(request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.changePassword(), request.body).then(async () => {
            let inputData = request.body;
            let loginManager = new LoginManager();
            let userDetails: any;
            if (inputData.userId) {
                userDetails = await loginManager.checkPasswordExists(inputData.userId);
                if (userDetails.length > 0) {
                    let chkPwd = Helper.verifyHashPassword(inputData.oldPassword, userDetails[0]["password"]);
                    if (!chkPwd) {
                        return Api.badRequest(request, response, "Invalid existing password")
                    }
                }
            } else {
                userDetails = await loginManager.checkUserExist(inputData.email, inputData.mobileNo);
            }
            if (userDetails && userDetails.length > 0) {
                let userId = inputData.userId ? inputData.userId : userDetails[0]['id'];
                let changePwd = await loginManager.changePassword(Helper.hashPassword(inputData.password), userId);
                let resp = {'status': 'Password changed successfully'};
                Api.ok(request, response, resp);
            } else {
                return Api.badRequest(request, response, "Invalid user details");
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    public register = async(request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.register(), request.body).then(async () => {
            let inputData = request.body;
            let loginManager = new LoginManager();
            let userName: any = await loginManager.chkUserNameExist(inputData.username);
            if (userName.length > 0) {
                return Api.badRequest(request, response, "Username already exists");
            }
            let userDetails: any = await loginManager.insertUser(inputData.username,
                inputData.email, Helper.hashPassword(inputData.password));
            if (userDetails) {
                let userID = userDetails['insertId'];

                let addUser = await loginManager.insertUserDetails(userID, inputData.username,
                    inputData.email, inputData.mobileNumber);
                Api.ok(request, response, {'status': 'User registered successfully'});
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    public verifyOTP = async(request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.verifyOTP(), request.body).then(async () => {
            let inputData = request.body;
            let loginManager = new LoginManager();
            let OTPInfo: any = await loginManager.verifyOTP(inputData.mobileNumber, inputData.otp);
            if (OTPInfo.length > 0) {
                let otpEntryID = OTPInfo[0]['id'];
                let resp = {
                    status: 'Verified successfully'
                }
                loginManager.updateVerifyOTP(otpEntryID);
                Api.ok(request, response, resp);
            } else {
                Api.badRequest(request, response, "Invalid OTP");
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    public verifyUser = async(request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.verifyUser(), request.body).then(async () => {
            try {
                let inputData = request.body;
                let loginManager = new LoginManager();
                let notificationBaseURL = this.baseConfig.microServiceConfig().notificationBaseURL;
                let isForgotPwd = inputData.isForgotPwd ? inputData.isForgotPwd : false;
                let isUserFound: Boolean = false;
                if (isForgotPwd) {
                    let userDetails: any = await loginManager.checkUserExist(inputData.email, inputData.mobileNo);
                    if (userDetails && userDetails.length > 0) {
                        isUserFound = true;
                    }
                }
                if (isForgotPwd && !isUserFound) {
                    return Api.badRequest(request, response, "Invalid user details");
                }
                let smsTemplate: any = await loginManager.getSMSTemplate(8, 'welcomeotp'); // OTP Template ID
                if (smsTemplate && smsTemplate.length > 0) {
                    let otp = Helper.generateOTP();
                    // Send OTP thru SMS
                    let message = Helper.replaceSMSContent(smsTemplate[0]["content"], "|params|", [otp]);
                    let smsReqObj = {
                        content: message,
                        numbers: inputData.mobileNo
                    }
                    Helper.sendHttpPostReq(notificationBaseURL + '/sms/send', smsReqObj);
                    // Send OTP thru EMail
                    let emailReqObj = {
                        to: inputData.email,
                        content: message,
                        subject: 'Welcome'
                    }
                    Helper.sendHttpPostReq(notificationBaseURL + '/email/send', emailReqObj);
                    loginManager.insertOTP(inputData.mobileNo, otp); // Store it in database
                    let resp = {"status": 'success'};
                    Api.ok(request, response, resp);
                }
            } catch (err) {
                Api.serverError(request, response, err);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    // creates the refresh token for 30 days
    private createRefreshToken(userId: string) {
        let jwtRefreshTokenConfig = this.baseConfig.JSONWebToken().refreshToken;
	        return JsonWebToken.sign({userId: userId, type: "refreshToken"}, jwt.secret,{expiresIn: jwtRefreshTokenConfig.expiresIn});
    }

    // create the access token for 10 mins
    private createToken(userId: string|string[]) {
        let jwtAccessTokenConfig = this.baseConfig.JSONWebToken().accessToken;
	     return JsonWebToken.sign({userId: userId, type: "accessToken"}, jwt.secret, {expiresIn: jwtAccessTokenConfig.expiresIn});
    };

    // attempts to login and saves the id in the corresponding tables
    public login = (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.sessionLogin(), request.body).then(async () => {
            let loginManager = new LoginManager();
            let username = request.body.username,
            password = request.body.password,
            pushToken = request.body.pushToken,
            deviceId = request.body.deviceId;
            try {
                let user: any = await loginManager.login(username);
                if (user.length) {
                    let authenticate = Helper.verifyHashPassword(password, user[0]["password"]);
                    let userId = user[0]["id"];
                    if (authenticate) {
                        let token = this.createToken(userId);
                        let refreshToken = this.createRefreshToken(userId);
                        loginManager.saveToken(user[0]["id"], refreshToken, pushToken , deviceId); 

                        let address = {
                            "apart_id": user[0]["apartment_id"],
                            "site_id": user[0]["site_id"],
                            "block_id": user[0]["block_id"],
                            "site_name": user[0]["site_name"],
                            "site_desc": user[0]["site_desc"],
                            "site_address": user[0]["site_address"],
                            "block_name": user[0]["block_name"],
                            "flat_no": user[0]["doorNo"],
                            "sqrft": user[0]["sqrft"]
                        }
                        let resp = {
                            userId: userId,
                            userName: username,
                            token: token,
                            refreshToken: refreshToken,
                            email: user[0]["email"],
                            mobileNo: user[0]["mobile_no"],
                            noOfPeople: user[0]["noofpeople"],
                            address: address
                        }
                        Api.ok(request, response, resp);
                    } else {
                        Api.unauthorized(request, response);
                    }
                } else {
                    Api.badRequest(request, response, "User Not found");
                }
            } catch (err) {
                Api.serverError(request, response, err);
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    };

    // accepts refresh token and return new token
    public refresh = (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.sessionRefresh(), request.body).then(async () => {
            let loginManager = new LoginManager();
            let refreshToken = request.body.refreshToken;
            let authenticate: any = Helper.verifyJwtToken(refreshToken);
            if (authenticate) {
                let userId = authenticate["userId"] || request.body.userId;
                let validateToken: any = await loginManager.validateToken(refreshToken, userId);
                if (validateToken.length) {
                    let newRefreshToken = this.createToken(userId);
                    let blockInfo: any = await loginManager.getLoggedInUserBlockInfo(userId);
                    let resp = {
                        token: newRefreshToken,
                    }
                    Api.ok(request, response, resp);
                } else {
                    console.log("Invalid");
                Api.badRequest(request, response, "Invalid Refresh Token");
                }
            } else {
                console.log("expired");
                Api.badRequest(request, response, "Token Expired");
            }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    // invalidates the refresh token making the user logout
    public logout = async (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.sessionRefresh(), request.body).then(async () => {
            let loginManager = new LoginManager();
            let token = request.body.refreshToken;
            let userId = request.body.userId;
            // let authenticate: any = Helper.verifyJwtToken(token);
            // if (authenticate) {
                try {
                    await loginManager.invalidateToken(token, userId);
                    Api.ok(request, response, "User Logged out");
                } catch (error) {
                    Api.serverError(request, response, error);
                }
            // } else {
            //     Api.badRequest(request, response, "Invalid Refresh Token")
            // }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }

    // update device id and push token for IOS app only
    public updateDeviceInfo = async (request: Request, response: Response, next: NextFunction) => {
        const validator = new ValidatorHelper();
        const schema = new ValidatorSchema();
        validator.jsonValidator(schema.updateDeviceInfo(), request.body).then(async () => {
            let loginManager = new LoginManager();
            let refreshToken = request.body.refreshToken;
            let userId = request.body.userId;
            let pushToken = request.body.pushToken;
            let deviceId = request.body.deviceId;
            // let authenticate: any = Helper.verifyJwtToken(token);
            // if (authenticate) {
                try {
                    await loginManager.updateDeviceInfo(pushToken,deviceId,refreshToken,userId);
                    Api.ok(request, response, "Device Id Updated");
                } catch (error) {
                    Api.serverError(request, response, error);
                }
            // } else {
            //     Api.badRequest(request, response, "Invalid Refresh Token")
            // }
        }).catch((error) => {
            Api.invalid(request, response, error);
        });
    }
}

