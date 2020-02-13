"use strict";
exports.__esModule = true;
var joi = require("joi");
var ValidatorSchema = /** @class */ (function () {
    function ValidatorSchema() {
    }
    /**
     * Joi validation Schema for Login
     */
    ValidatorSchema.prototype.sessionLogin = function () {
        return joi.object({
            username: joi.string().required(),
            password: joi.string().required()
        });
    };
    /**
     * Joi validation Schema for Refresh
     */
    ValidatorSchema.prototype.sessionRefresh = function () {
        return joi.object({
            refreshToken: joi.string(),
            userId: joi.string()
        });
    };
    /**
     * Joi validation Schema for Dashboard
     */
    ValidatorSchema.prototype.dashboard = function () {
        return joi.object({
            site_id: joi.number().required(),
            block_id: joi.number().required(),
            apart_id: joi.number().required(),
            from_date: joi.string().required(),
            to_date: joi.string().required()
        });
    };
    /**
     * Joi validation Schema for Logout
     */
    ValidatorSchema.prototype.sessionLogout = function () {
        return joi.object({
            token: joi.string().required()
        });
    };
    /**
     * Joi validation for download invoice
     */
    ValidatorSchema.prototype.downloadInvoice = function () {
        return joi.object({
            site_id: joi.number().required(),
            site_name: joi.string().required(),
            block_name: joi.string().required(),
            cust_name: joi.string().required(),
            invoice_month: joi.number().required(),
            invoice_year: joi.number().required()
        });
    };
    /**
     * Joi validation Schema for trending
     */
    ValidatorSchema.prototype.trendingReport = function () {
        return joi.object({
            site_id: joi.number().required(),
            block_id: joi.number().required(),
            apart_id: joi.number(),
            from_date: joi.string().required(),
            to_date: joi.string().required()
        });
    };
    /**
     * Generate Invoice Notification schema
     */
    ValidatorSchema.prototype.generateInvoiceNotify = function () {
        return joi.object({
            apartId: joi.array().items(joi.string()).required(),
            message: joi.string().required()
        });
    };
    /**
     * Verify Mobile and Email registration schema
     */
    ValidatorSchema.prototype.verifyUser = function () {
        return joi.object({
            mobileNo: joi.string().required(),
            email: joi.string().required(),
            isForgotPwd: joi.boolean()
        });
    };
    // Schema to verify OTP
    ValidatorSchema.prototype.verifyOTP = function () {
        return joi.object({
            mobileNumber: joi.string().required(),
            otp: joi.string().required()
        });
    };
    ValidatorSchema.prototype.register = function () {
        return joi.object({
            name: joi.string().required(),
            email: joi.string().required(),
            mobileNumber: joi.string().required(),
            username: joi.string().required(),
            password: joi.string().required()
        });
    };
    // User can change their password by two ways
    // Either they can send their email and mobile
    // or they can send their user ID and old password
    ValidatorSchema.prototype.changePassword = function () {
        return joi.object({
            email: joi.string(),
            mobileNo: joi.string(),
            oldPassword: joi.string().description('this key will required only if user ID is there'),
            userId: joi.string().description('this key is not mandatory but if user ID is there then oldPassword also required'),
            password: joi.string().required()
        });
    };
    // User can change their password by two ways
    // Either they can send their email and mobile
    // or they can send their user ID and old password
    ValidatorSchema.prototype.updateDeviceInfo = function () {
        return joi.object({
            refreshToken: joi.string().required(),
            pushToken: joi.string(),
            deviceId: joi.string(),
            userId: joi.number()
        });
    };
    return ValidatorSchema;
}());
exports.ValidatorSchema = ValidatorSchema;
