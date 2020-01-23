import { MysqlConnection, mysql  } from './mysql.config';
import * as SqlConnection from 'mysql';

export class SqlManager {

    private _mysql: SqlConnection.Pool;
    private params;

    constructor() {
        this._mysql = mysql.getMysql();
    }

    public ExecuteQuery(qry: string) {
        return new Promise((resolve, reject) => {
            this._mysql.query(qry, function(error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    public Get(qry: string, params: Array<any>) {
        console.log(params);
        // let query = this._mysql.format(qry, params);

        return new Promise((resolve, reject) => {
            this._mysql.query(qry, params, function(error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}
