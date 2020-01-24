import * as express from 'express';
import { UserController } from './controllers/user.controller';
import { LoginController } from './controllers/login.controller';
import { DashboardController } from './controllers/dashboard.controller';
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
