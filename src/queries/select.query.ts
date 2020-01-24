export const SelectQuery = {
    getUserDetails : 'select 1 as dummy',
        loginCheck : `SELECT DISTINCT user_details.*,
    users.id,users.username,users.password,users.nickname,Ma.cust_name as doorNo,
    site_name,site_desc,site_address,block_name,
    Mb.is_under_maintenance,
    Mb.maintenance_msg FROM users
    left join user_details on users.id = user_details.user_id
    left join mintix_site_qa1 on user_details.site_id =mintix_site_qa1.site_id
    left join mintix_block as Mb ON user_details.block_id= Mb.id
    left join mintix_apart as Ma ON user_details.apartment_id= Ma.id
    left join mintix_apart_properties as Map ON user_details.apartment_id= Map.apart_id
    WHERE username =? `,
    getUsage :`SELECT  cd.apart_id,day_total, cd.cust_name,     cd.id,     cd.component_id,max(cdt.udt) as last_updated_date FROM mintix_component_dtl cd left join mintixdb.mintix_component_day_total cdt on cd.apart_id = cdt.apart_id and cdt.dt >= ? and cdt.dt <= ? and cd.component_id = cdt.comp_id where cd.apart_id = ?    group by cd.apart_id,component_id`,
    validateToken: `SELECT * from user_token where user_id =? and isActive = 1 and refresh_Token = ? `,
    currentMonthUsage: `SELECT
    cust_name as inlet,
    sum(day_total) as inlet_usage
    FROM mintixdb.mintix_component_day_total cdt
    JOIN mintix_component_dtl cd on cdt.comp_id = cd.component_id
    WHERE cdt.apart_id = ?
    AND month(cdt.dt) = ?
    AND year(cdt.dt) = ?
    GROUP BY cust_name WITH rollup`,
    listUserSession: `
    SELECT DISTINCT user_details.user_id,device_id as deviceId,push_token as pushToken
    FROM user_details
    JOIN user_token ON user_token.user_id = user_details.user_id
    where user_details.apartment_id = ? and user_token.isActive=1`,
    apartmentCompDayUsage: `
    SELECT
    cd.apart_id,
    sum(day_total) as day_total,
    cd.cust_name,
    cd.id,
    cd.component_id,
    DATE_FORMAT(dt, '%Y-%m-%d') as last_updated_date
    FROM w2_mintix_dtl cd
    left  join we2db.w2_mintix_day_total cdt on cd.apart_id = cdt.apart_id
    and cdt.dt >= ? and cdt.dt <= ? and cd.component_id = cdt.comp_id
    left outer join w2_apart_master am on  am.id = cdt.apart_id
    where cd.apart_id = ?
    group by cd.apart_id,component_id,dt`,
    componentList: `SELECT cd.cust_name,
    (CASE  WHEN cd.cust_name LIKE 'room1%' or cd.cust_name LIKE 'room2% 'END) as icon
    FROM mintixdb.mintix_component_dtl cd where cd.apart_id=?`,
    getBlockInfo: `
    SELECT MB.id,MB.block_name,
    MB.is_under_maintenance,
    MB.maintenance_msg FROM mintix_block as MB
	join user_details ON user_details.block_id= MB.id
    join mintix_apart as w2a ON user_details.apartment_id= w2a.id
    join user_token ON user_details.user_id= user_token.user_id
    WHERE user_details.user_id = ?`,
    listSessionApart: `
    SELECT DISTINCT user_details.user_id,device_id as deviceId,push_token as pushToken
    FROM user_details
    JOIN user_token ON user_token.user_id = user_details.user_id
    where user_details.apartment_id IN (:queryStr) and user_token.isActive=1`,
    smsTemplate: `
    select * from w2_sms_templates where id = ? or message_name = ?`,
    verifyOTP: `SELECT * FROM we2db.otp
    where mobile_number=? and TIMESTAMPDIFF(minute, dt, now()) <=30 and verified = 'N'
    and otp =? order by dt desc limit 1`,
    chkUserExists: `SELECT username FROM we2db.users where username=?`,
    userDetailsExists: `select * from users
    inner join user_details ON user_details.user_id = users.profile_map_id
    where users.email = ? and user_details.mobile_no = ?`,
    checkPasswordExists: `select * from users where id = ?`
}
