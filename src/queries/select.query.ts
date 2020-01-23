export const SelectQuery = {
    getUserDetails : 'select 1 as dummy',
        loginCheck : `SELECT DISTINCT user_details.*,
    users.id,users.username,users.password,users.nickname,w2a.cust_name as doorNo,noofpeople,
    site_name,site_desc,site_address,block_name,user_details.sqr_ft as sqrft,
    w2b.is_under_maintenance,
    w2b.maintenance_msg FROM users
    left join user_details on users.id = user_details.user_id
    left join w2_site_qa1 on user_details.site_id = w2_site_qa1.site_id
    left join w2_block as w2b ON user_details.block_id= w2b.id
    left join w2_apart_master as w2a ON user_details.apartment_id= w2a.id
    left join w2_apart_properties as w2ap ON user_details.apartment_id= w2ap.apart_id
    WHERE username =? `,
    getUsage :`SELECT  cd.apart_id, sum(cdt.day_total) as day_total, cd.current_KW ,   cd.cust_name,     cd.id,     cd.component_id,     alarms.alarm_type,     alarms.activeAlarm,     max(cdt.udt) as last_updated_date     FROM w2_mintix_dtl cd     left join we2db.w2_mintix_day_total cdt on cd.apart_id = cdt.apart_id     and cdt.dt >= ? and cdt.dt <= ? and cd.component_id = cdt.comp_id  left outer join (SELECT comp_id,alarm_type,activeAlarm FROM w2_alarms as al inner join (SELECT MAX(id) AS id FROM w2_alarms where apart_id = ? GROUP BY comp_id) as alarm_ids on alarm_ids.id = al.id) as alarms on alarms.comp_id = cd.id     where cd.apart_id = ?    group by cd.apart_id,component_id,alarms.alarm_type,alarms.activeAlarm`,
    validateToken: `SELECT * from user_token where user_id =? and isActive = 1 and refresh_Token = ? `,
    currentMonthUsage: `SELECT
    cust_name as inlet,
    sum(day_total) as inlet_usage
    FROM we2db.w2_mintix_day_total cdt
    JOIN w2_mintix_dtl cd on cdt.comp_id = cd.component_id
    WHERE cdt.apart_id = ?
    AND month(cdt.dt) = ?
    AND year(cdt.dt) = ?
    GROUP BY cust_name WITH rollup`,
    calcualteEstimate: `
    SELECT sum(
    case  when :usage > slabto then ((slabto-slabfrom)*slabrate)
    when :usage < slabto and :usage > slabfrom then ((:usage-slabfrom)*slabrate)
    end) as estimate FROM we2db.w2_slab_rates_dtl where site_id = ? and enabled = 1`,
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
    FROM we2db.w2_mintix_dtl cd where cd.apart_id=?`,
    getBlockInfo: `
    SELECT w2b.id,w2b.block_name,
    w2b.is_under_maintenance,
    w2b.maintenance_msg FROM w2_block as w2b
	join user_details ON user_details.block_id= w2b.id
    join w2_apart_master as w2a ON user_details.apartment_id= w2a.id
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
