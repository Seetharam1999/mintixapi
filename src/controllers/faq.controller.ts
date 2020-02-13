import { Router, Request, Response, NextFunction } from 'express';
import { Api } from './../helpers';
import { Helper } from '../helpers/helper';
import { ValidatorHelper } from '../helpers/validate';
import { ValidatorSchema } from '../validator-schema/schema';
import { map, groupBy } from 'lodash';
import { FAQManager } from '../data-manager/faq.manager';

export class FAQController {
    public static route = '/faq';
    public router: Router = Router();
    constructor() {
        this.router.post("/", this.addFAQ);
        this.router.get("/", this.listFAQ);
    }

    public listFAQ = async(request: Request, response: Response, next: NextFunction) => {
        try {
            let faqManager = new FAQManager();
            let resp = await faqManager.listFAQ();
            Api.ok(request, response, groupBy(resp, "category"));
        } catch (err) {
            Api.serverError(request, response, err);
        }
    }

    public addFAQ = async(request: Request, response: Response, next: NextFunction) => {
        let faqManager = new FAQManager();
        let inputData = request.body;
        let faqReqData = [];
        Object.keys(inputData).forEach(k => {
            let data = inputData[k];
            map(data, (o) => {
                let newObj = Object.assign({}, o);
                o.categoryId = k;
                faqReqData.push([Number(o.categoryId), o.q, o.a, 1]);
            });
        });
        faqManager.insertFAQ(faqReqData);
    }

}
