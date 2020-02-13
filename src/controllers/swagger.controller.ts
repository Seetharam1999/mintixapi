import { Router, Request, Response, NextFunction, Express } from 'express';
const swaggerUi = require('swagger-ui-express');
const sessionDocument = require('../swagger-docs/session.json');
const dashboardDocument = require('../swagger-docs/dashboard.json');
const billingDocument = require('../swagger-docs/billing.json');
const alarmDocument = require('../swagger-docs/alarm.json');
import * as path from 'path';

export class SwaggerController {
    public static route = '/swagger';
    public router: Router = Router();

    private options = {
        explorer: true
    };

    constructor(app: Express) {
        app.use('/swagger/session', swaggerUi.serve, swaggerUi.setup(sessionDocument));
        app.use('/swagger/dashboard', swaggerUi.serve, swaggerUi.setup(dashboardDocument));
        app.use('/swagger/billing', swaggerUi.serve, swaggerUi.setup(billingDocument));
        app.use('/swagger/alarm', swaggerUi.serve, swaggerUi.setup(alarmDocument));
        app.use('/swagger', this.getUrl);
    }
    public getUrl(req: Request, res: Response, next: NextFunction) {
        res.sendFile(path.join(__dirname, '../swagger-docs', 'index.html'));
    }
}
