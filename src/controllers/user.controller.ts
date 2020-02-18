import { Router, Request, Response, NextFunction } from 'express';
import { Api } from './../helpers';
import { UserManager } from './../data-manager/user.manager';
export class UserController {
    public static route = '/user';
    public router: Router = Router();
    constructor() {
        this.router.get('/:userId', this.getUserDetails);
    }

    // get the user details
    public getUserDetails(request: Request, response: Response, next: NextFunction) {
        let userManager = new UserManager();
        let userId = request.params.userId;
        userManager.getUserDetails(userId).then((result) => {
            Api.ok(request, response, result);
        }).catch((err) => {
            Api.serverError(request, response, err);
        });
    }
}
