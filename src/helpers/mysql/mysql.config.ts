import { AppSetting } from '../../config';
import * as SqlConnection from 'mysql';
export class MysqlConnection {
    private mysql: SqlConnection.Pool;
    public setConnection() {
        const config = AppSetting.getConfig();
        const dbInfo = config.DbConnectionString();
        this.mysql = SqlConnection.createPool({
            host     : dbInfo.url,
            user     : dbInfo.user,
            password : dbInfo.password,
            database : dbInfo.database,
            connectionLimit: 25
        });
        this.ping();
    }

    public ping() {
        this.mysql.on('connect', function (sequence) {
            console.log('DB Connection established');
          });
        this.mysql.query('SELECT 1', function (error, results, fields) {
            if (error) {
                console.log(error);
             throw error;
            }
            console.log('Database Connection Established ');
          });
        //   setInterval(() => {
        //     this.mysql.query('SELECT 1', function (error, results, fields) {
        //         if (error) {
        //          throw error;
        //         }
        //       })
        //     }, 40000);
         // logging the queries
        this.mysql.on('enqueue', function (sequence) {
            if (sequence.constructor.name === 'Query') {
              console.log(sequence.sql);
            }
          });
         // logging the queries
        this.mysql.on('enqueue', function (sequence) {
            if (sequence.constructor.name === 'Query') {
              console.log(sequence.sql);
            }
          });
    }
    public getMysql() {
        return this.mysql;
    }
}

export const mysql = new MysqlConnection() ;
