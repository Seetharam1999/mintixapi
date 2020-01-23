import { SqlManager } from '../helpers/mysql/sql.manager';
import * as SqlConnection from 'mysql';
import {SelectQuery} from './../queries/select.query';
import {InsertQuery} from './../queries/insert.query';
import {UpdateQuery} from './../queries/update.query';

export class LoginManager {

    private db: SqlManager;
    constructor() {
        this.db = new SqlManager();
    }

    /**
     * Login
     * @param username
     * @param password
     */
    public login(username: string) {
        return this.db.Get(SelectQuery.loginCheck, [username]);
    }

    /**
     * Save the token to database
     * @param userId
     * @param refreshtoken
     * @param pushToken
     * @param deviceId
     */
    public saveToken(userId: number, token: string, pushToken: string, deviceId: string ) {
        return this.db.Get(InsertQuery.saveToken, [userId, token, pushToken, deviceId]);
    }

    /**
     * Save the token to database
     * @param userId
     */
    public invalidateToken(token: string, userId: number) {
        return this.db.Get(UpdateQuery.invalidateToken, [token, userId]);
    }


    /**
     * validate the token to database
     * @param userId
     * @param token
     */
    public validateToken(token: string, userId: number) {
        return this.db.Get(SelectQuery.validateToken, [userId, token]);
    }
    /**
     * Get user session list
     * @param apartId
     */
    public getUserSessionList(apartId: number) {
        return this.db.Get(SelectQuery.listUserSession, [apartId]);
    }
    /**
     * Get logged In user block info
     * @param userId
     */
    public getLoggedInUserBlockInfo(userId) {
        return this.db.Get(SelectQuery.getBlockInfo, [userId]);
    }
    // get Logged in user session for given list of apartment
    public getSessionListUsingApart(apartIds) {
        return this.db.Get(SelectQuery.listSessionApart.replace(':queryStr', apartIds), []);
    }
    // Get SMS template
    public getSMSTemplate(smsTypeId, smsType) {
        return this.db.Get(SelectQuery.smsTemplate, [smsTypeId, smsType]);
    }
    // Insert OTP
    public insertOTP (mobileNumber, otp) {
        return this.db.Get(InsertQuery.insertOTP, [mobileNumber, otp, 'N']);
    }
    // Verify OTP
    public verifyOTP(mobileNumber, otp) {
        return this.db.Get(SelectQuery.verifyOTP, [mobileNumber, otp]);
    }
    // Update verify OTP
    public updateVerifyOTP(id) {
        return this.db.Get(UpdateQuery.setVerifiedOTP, [id]);
    }
    // Check user name exists or not
    public chkUserNameExist(userName) {
        return this.db.Get(SelectQuery.chkUserExists, [userName]);
    }
    // Insert user basic details
    public insertUser(username, email, password) {
        return this.db.Get(InsertQuery.insertUser, [username, username, email, password]);
    }
    // Insert user details
    public insertUserDetails(userId, userName, email, mobileNo) {
        return this.db.Get(InsertQuery.insertUserDetails, [userId, userName, email, mobileNo]);
    }
    // Check user exists
    public checkUserExist(email, mobileNo) {
        return this.db.Get(SelectQuery.userDetailsExists, [email, mobileNo]);
    }
    public changePassword(password, userId) {
        return this.db.Get(UpdateQuery.updatePassword, [password, userId]);
    }
    public checkPasswordExists(userId) {
        return this.db.Get(SelectQuery.checkPasswordExists, [userId]);
    }
    public updateDeviceInfo(pushToken,deviceId,refreshToken,userId) {
        return this.db.Get(UpdateQuery.updateDeviceInfo, [pushToken,deviceId,refreshToken,userId]);
    }
}
