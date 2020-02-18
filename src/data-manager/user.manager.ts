import { SqlManager } from '../helpers/mysql/sql.manager';
import * as SqlConnection from 'mysql';
import {SelectQuery} from './../queries/select.query'
export class UserManager {

    private db: SqlManager;
    constructor() {
        this.db = new SqlManager();
    }

    /**
     * Get the User Details
     * @param userId
     */
    public getUserDetails(userId: string) {
        return this.db.Get(SelectQuery.getUserDetails, [userId]);
    }

}
