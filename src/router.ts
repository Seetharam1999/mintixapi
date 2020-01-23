import * as express from 'express';
import { UserController } from './controllers/user.controller';
import { LoginController } from './controllers/login.controller';
import { BillingController } from './controllers/billing.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { AlarmController } from './controllers/alarm.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { FAQController } from './controllers/faq.controller';
import { NotificationController } from './controllers/notification.controller';
export class ApiRouting {

    public static ConfigureRouters(app: express.Router) {
        // delcare the route configs... and the respective files yet to be created
        // the files to be created inside controllers
	        app.use(UserController.route, new UserController().router);
        app.use(DashboardController.route, new DashboardController().router);
      }


    public static ConfigureUnAuthRouters(app: express.Router) {
     app.use(LoginController.route, new LoginController().router);
        }
}
