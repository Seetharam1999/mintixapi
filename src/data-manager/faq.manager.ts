
import { SqlManager } from '../helpers/mysql/sql.manager';
import * as SqlConnection from 'mysql';
import {SelectQuery} from './../queries/select.query';
import { InsertQuery } from './../queries/insert.query';

export class FAQManager {

    private db: SqlManager;
    constructor() {
        this.db = new SqlManager();
    }
    public insertFAQ(faqInArr) {
        return this.db.Get(InsertQuery.insertFAQ, [faqInArr]);
    }
    public listFAQ() {
        return this.db.Get(SelectQuery.listFAQ, [1, 1]);
    }
}
