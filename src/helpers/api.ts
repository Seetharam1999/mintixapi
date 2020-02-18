'use strict';

import { Environment } from '../config/environment';
import { Request, NextFunction, Response } from 'express';
import { HttpStatusCode } from './index';
import { Config } from '../config/config';

const _hasOwnProperty = Object.prototype.hasOwnProperty;

function statusMessage(status: HttpStatusCode) {
    switch (status) {
        case HttpStatusCode.BAD_REQUEST:
            return 'Bad Request';
        case HttpStatusCode.UNAUTHORIZED:
            return 'Unauthorized';
        case HttpStatusCode.FORBIDDEN:
            return 'Forbidden';
        case HttpStatusCode.NOT_FOUND:
            return 'Not Found';
        case HttpStatusCode.UNSUPPORTED_ACTION:
            return 'Unsupported Action';
        case HttpStatusCode.VALIDATION_FAILED:
            return 'Validation Failed';
        case HttpStatusCode.SERVER_ERROR:
            return 'Internal Server Error';
        case HttpStatusCode.CREATED:
            return 'Created';
    }
}

function jsonResponse(res, body, options) {
    options = options || {};
    options.status = options.status || HttpStatusCode.OK;
    res.status(options.status).json(body || null);
}

function existsInBody(req, param) {
    return req.body && req.body[param];
}

function existsInQuery(req, param) {
    return req.query && req.query[param];
}

function existsInParams(req, param) {
    return req.params && req.params[param];
}

const Api = {
    ok: function (req, res, data) {
        jsonResponse(res, data, {
            status: HttpStatusCode.OK
        });
    },

    badRequest: function (req, res, errors) {
        errors = Array.isArray(errors) ? errors : [errors];

        let body = {
            message: statusMessage(HttpStatusCode.BAD_REQUEST),
            errors: errors
        };

        jsonResponse(res, body, {
            status: HttpStatusCode.BAD_REQUEST
        });
    },

    unauthorized: function (req, res) {
        let body = {
            message: statusMessage(HttpStatusCode.UNAUTHORIZED)
        };

        jsonResponse(res, body, {
            status: HttpStatusCode.UNAUTHORIZED
        });
    },

    forbidden: function (req, res) {
        let body = {
            message: statusMessage(HttpStatusCode.FORBIDDEN)
        };

        jsonResponse(res, body, {
            status: HttpStatusCode.FORBIDDEN
        });
    },
    notFound: function (req, res) {
        let body = {
            message: statusMessage(HttpStatusCode.NOT_FOUND)
        };
        // let log = new Logger('Error');
        // log.error(HttpStatusCode.NOT_FOUND);

        jsonResponse(res, body, {
            status: HttpStatusCode.NOT_FOUND
        });
    },

    unsupportedAction: function (req, res) {
        let body = {
            message: statusMessage(HttpStatusCode.UNSUPPORTED_ACTION)
        };
        // let log = new Logger('Error');
        // log.error(HttpStatusCode.UNSUPPORTED_ACTION);
        jsonResponse(res, body, {
            status: HttpStatusCode.UNSUPPORTED_ACTION
        });
    },

    invalid: function (req, res, errors) {
        errors = Array.isArray(errors) ? errors : [errors];

        let body = {
            message: statusMessage(HttpStatusCode.VALIDATION_FAILED),
            errors: errors
        };
        // let log = new Logger('Error');
        // log.error(HttpStatusCode.VALIDATION_FAILED + body.message);
        jsonResponse(res, body, {
            status: HttpStatusCode.VALIDATION_FAILED
        });
    },
    serverError: function (req, res, error) {
        if (error instanceof Error) {
            error = {
                message: error.message,
                stacktrace: error.stack
            };
        }
        let body = {
            message: statusMessage(HttpStatusCode.SERVER_ERROR),
            error: (Config.getConfig().appConfig().environment === Environment[Environment.development]) ? error : error.message,
          //  query: ResultHelper.fetchResultWithSQLInfo(req, '')
        };
        // let log = new Logger('Error');
        // log.error(HttpStatusCode.VALIDATION_FAILED + body.message);
        jsonResponse(res, body, {
            status: HttpStatusCode.SERVER_ERROR
        });
    },

    requireParams: function (req: Request, res: Response, next: NextFunction, params) {

        let missing = [];
        if (params.all) {
            params.all.forEach(function (param) {
                if (!existsInBody(req, param) && !existsInQuery(req, param) && !existsInParams(req, param)) {
                    missing.push('Missing required parameter: ' + param);
                }
            });
        }
        if (params.any) {
            let count = 0;
            params.any.forEach(function (param) {
                if (existsInBody(req, param) || existsInQuery(req, param) || existsInParams(req, param)) {
                    count++;
                }
            });
            if (count === 0) {
                missing.push("Any one of the following parameters are required: " + params.any)
            }
        }
        if (missing.length) {
            // let log = new Logger('Input Error');
            // log.error(missing);
            // return Api.badRequest(req, res, missing);
        }
        return next();
    },
    created: function (req, res, data) {
        jsonResponse(res, data, {
            status: HttpStatusCode.OK
        });
    },

    requireHeaders: function (req, res, headers, next) {
        let missing = [];

        headers = Array.isArray(headers) ? headers : [headers];

        headers.forEach(function (header) {
            if (!(req.headers && _hasOwnProperty.call(req.headers, header))) {
                missing.push('Missing required header parameter: ' + header);
            }
        });

        if (missing.length) {
            // let log = new Logger('Input Error');
            // log.error(missing);
            // Api.badRequest(req, res, missing);
        } else {
            next();
        }
    }
};

export { Api }
