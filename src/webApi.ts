import { Router, Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import * as http from 'http';
import * as express from 'express';
import * as compression from 'compression';

import { Api, Helper } from './helpers';
import { Config } from './config/config';
import { BaseConfig } from './config/index';
import { IAppConfig } from './config/iappconfig';
import { ApiRouting } from './router';
import { SwaggerController } from './controllers/swagger.controller';

export class WebApi {

    public app: express.Express;
    private router: express.Router;
    private appConfig: IAppConfig;
    private baseConfig: BaseConfig;
    constructor() {
        this.app = express();
        this.router = express.Router();
        this.baseConfig = Config.getConfig();
        this.appConfig = this.baseConfig.appConfig();
        this.configureMiddleware();
        this.configureUnAuthRoutes();
	   this.authenticateRequest(this.app);
        this.configureRoutes();
    }

         private authenticateRequest(app) {
        app.use(async function (req, res, next) {
            if (req.url === '/') {
                return res.json({
                    name: "MINTIX API",
                    version: "1.0",
                });
            } else {
	    let auth = req.headers['x-access-token'] || req.headers["token"].split(" ")[0];
	console.log(auth);
		auth = auth.indexOf(",") > -1 ? auth.split(",")[0] : auth;
                if (!auth) {
                    return Api.unauthorized(req, res);
                }
                let authenticate: any = Helper.verifyJwtToken(auth);
                if (authenticate) {
                    req.headers["userId"] = authenticate["userId"];
                    next();
                } else {
                    return Api.unauthorized(req, res);
                }
            }
        });
	}

    private configureMiddleware() {
        this.app.use(json({ limit: '50mb' }));
        this.app.use(compression());
        this.app.use(urlencoded({ limit: '50mb', extended: true }));
    }
    private configureUnAuthRoutes() {
        let swagger = new SwaggerController(this.app);
        this.app.use("/swagger", swagger.router);
        ApiRouting.ConfigureUnAuthRouters(this.app);
    }
    private configureRoutes() {
        this.app.use('/', this.router);
        ApiRouting.ConfigureRouters(this.app);
    }

    private handleRejections() {

    }

    public run() {
        let server = http.createServer(this.app);
        server.listen(this.appConfig.port);
        server.on('error', this.onError);
        this.handleRejections();
    }

    private onError(error) {
        console.log(error);
        let port = this.appConfig.port;
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}
