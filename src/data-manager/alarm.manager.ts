
import { SqlManager } from '../helpers/mysql/sql.manager';
import * as SqlConnection from 'mysql';
import {SelectQuery} from './../queries/select.query';
import { InsertQuery } from './../queries/insert.query';
import { UpdateQuery } from './../queries/update.query';

export class AlarmManager {

    private db: SqlManager;
    constructor() {
        this.db = new SqlManager();
    }

    public getAlarmHistory(apartId, to, from) {
        return this.db.Get(SelectQuery.alarmHistory, [apartId, to + ' 23:59:59', from + ' 00:00:00'] );
    }

    public getAlarmMessage(pushNotificationTempId, componentId: string) {
        return this.db.Get(SelectQuery.alarmMessage, [pushNotificationTempId, pushNotificationTempId, componentId] );
    }

    public insertAlarmHistory(reqObj) {
        let apartId = reqObj.apartId;
        let compId = reqObj.compId;
        let alarmType = reqObj.alarmType;
        let status = reqObj.status;
        let activeAlarm = reqObj.status;
        return this.db.Get(InsertQuery.insertAlarmHistory, [apartId, compId, alarmType, status, activeAlarm]);
    }

    public resetAlarm(reqObj) {
        let apartId = reqObj.apartId;
        let compId = reqObj.compId;
        let alarmType = reqObj.alarmType;
        let status = reqObj.status;
        let activeAlarm = reqObj.status;
        return this.db.Get(UpdateQuery.resetAlarm, [apartId, compId, alarmType, status, activeAlarm]);
    }
}
