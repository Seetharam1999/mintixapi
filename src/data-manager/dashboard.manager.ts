import { SqlManager } from '../helpers/mysql/sql.manager';
import * as SqlConnection from 'mysql';
import {SelectQuery} from './../queries/select.query'

export class DashboardManager {

    private db: SqlManager;
    constructor() {
        this.db = new SqlManager();
    }

    /**
     * Get the User Details
     * @param userId
     */
    public getUsage(fromDate: string, toDate: string, apartId: string) {
        return this.db.Get(SelectQuery.getUsage, [ fromDate, toDate, apartId, apartId]);
    }
     /**
      * Get Apartment Component day usage
      * @param apartId
      * @param fromDate
      * @param toDate
      */
    public getApartmentCompDayUsage(apartId: number, fromDate: string, toDate: string) {
        return this.db.Get(SelectQuery.apartmentCompDayUsage, [fromDate, toDate, apartId]);
    }
    /**
     * Get component assigned to given apartment
     * @param apartId
     */
    public getComponentList(apartId: number) {
        return this.db.Get(SelectQuery.componentList, [apartId]);
    }

}
