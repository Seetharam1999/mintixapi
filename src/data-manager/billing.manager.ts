
import { SqlManager } from '../helpers/mysql/sql.manager';
import * as SqlConnection from 'mysql';
import {SelectQuery} from './../queries/select.query'

export class BillingManager {

    private db: SqlManager;
    constructor() {
        this.db = new SqlManager();
    }

    // get billing for given months
    public getBilling(apartId: number, siteId: number , months) {
        return this.db.Get(SelectQuery.billing.replace(':queryString', months), [apartId, siteId] );
    }

    // get billing history for given apartment
    public getBillingHistory(apartId: number, siteId: number , limit: number, skip: number) {
        let queryStr: string = "limit " + limit + " offset " + skip;
        console.log(queryStr);
        return this.db.Get(SelectQuery.billingHistory.replace(':queryStr', queryStr), [apartId, siteId] );
    }

    public getCurrentMonthUsage(apartId, currentMonth, currentYear) {
        return this.db.Get(SelectQuery.currentMonthUsage, [apartId, currentMonth, currentYear] );
    }
    public getEstimate(siteId, usage) {
        return this.db.Get(SelectQuery.calcualteEstimate.replace(/:usage/g, usage), [siteId] );
    }

}
