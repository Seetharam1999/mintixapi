export const SelectQuery = {
    getUserDetails : 'select 1 as dummy',
    loginCheck : `SELECT DISTINCT user_details.*,
users.id,users.username,users.password,users.nickname,Ma.cust_name as doorNo,
site_name,site_desc,block_name,
Mb.is_under_maintenance,
Mb.maintenance_msg FROM users
left join user_details on users.id = user_details.user_id
left join min_site_qa1 on user_details.site_id =min_site_qa1.site_id
left join min_block as Mb ON user_details.block_id= Mb.id
left join min_apart_master as Ma ON user_details.apartment_id= Ma.id
WHERE username =?`,
    getUsage : `SELECT
    cd.apart_id,
    min_gateway.status as block_status,
    sum(day_total) as day_total,
    cd.cust_name,
    cd.id,
    cd.component_id,
    alarms.alarm_type,
    alarms.activeAlarm,
    max(cdt.udt) as last_updated_date
    FROM min_component_dtl cd
    left join min_component_day_total cdt on cd.apart_id = cdt.apart_id
    and cdt.dt >=? and cdt.dt <=? and cd.component_id = cdt.comp_id
    left join min_apart_master am on  am.id = cd.apart_id
    left join min_block wb ON wb.id = am.block_id
    left join min_gateway on min_gateway.gateway_physical_id = wb.gateway_id
    left outer join (SELECT comp_id,alarm_type,activeAlarm FROM min_alarms as al
	inner join
	(SELECT MAX(id) AS id FROM min_alarms where apart_id = ? GROUP BY comp_id) as alarm_ids
	on alarm_ids.id = al.id) as alarms on alarms.comp_id = cd.id
    where cd.apart_id = ?
    group by cd.apart_id,component_id,alarms.alarm_type,alarms.activeAlarm,block_status`,
    validateToken: `SELECT * from user_token where user_id =? and isActive = 1 and refresh_Token = ? `,
    billing: `SELECT
    inv.inv_no,
    inv.rental_component_charges,
    inv.service_fees,
    inv.venaqua_amc,
    inv.cur_mon_cost,
    year(STR_TO_DATE(bill_from, '%Y/%m/%d')) as year,
    cur_mon_usage,
    inv.total,
    inv.inlet_usage,
    inv.inlet,
    inv.bill_month,
    inv.bill_from,inv.bill_to,
    inv.billed_date,
    inv.due_date,
    inv.tax,
    site_id,
    apart_id,
    month_select
    FROM mintixdb.min_inv_history inv
    inner join (select max(id) AS id from min_inv_history inr  WHERE
    apart_id = ? AND
    site_id = ? AND
    (year(STR_TO_DATE(bill_from, '%Y/%m/%d')),month_select)  in (:queryString) group by month_select) AS sub
    ON sub.id = inv.id`,
    billingHistory: `
    SELECT
    inv.inv_no,
    inv.rental_component_charges,
    inv.service_fees,
    inv.venaqua_amc,
    inv.cur_mon_cost,
    SUBSTRING(inv.bill_month,-4,4) as year,
    cur_mon_usage,
    inv.total,
    inv.inlet_usage,
    inv.inlet,
    inv.bill_month,
    inv.bill_from,inv.bill_to,
    inv.billed_date,
    inv.due_date,
    inv.tax,
    site_id,
    apart_id,
    month_select
    FROM mintixdb.min_inv_history inv
    where apart_id = ? and site_id = ?
    order by bill_from desc :queryStr`,
    currentMonthUsage: `SELECT
    cust_name ,
    sum(day_total) as inlet_usage
    FROM mintixdb.mintix_component_day_total cdt
    JOIN mintix_component_dtl cd on cdt.comp_id = cd.component_id
    WHERE cdt.apart_id = ?
    AND month(cdt.dt) = ?
    AND year(cdt.dt) = ?
    GROUP BY cust_name WITH rollup`,
    calcualteEstimate: `
    SELECT sum(
    case  when :usage > slabto then ((slabto-slabfrom)*slabrate)
    when :usage < slabto and :usage > slabfrom then ((:usage-slabfrom)*slabrate)
    end) as estimate FROM mintixdb.min_slab_rates_dtl where site_id = ? and enabled = 1`,
    alarmHistory: `SELECT a.id,a.apart_id,cd.component_id,a.alarm_type,state,activeAlarm,cd.cust_name,
    date_format(a.dt, '%Y-%m-%dT%r') as start_date
    FROM mintixdb.min_alarms a join min_component_dtl cd on cd.id = a.comp_id
    where a.apart_id = ? and a.dt <= ? and a.dt >= ?`,
    alarmMessage: `
    SELECT mincdtl.apart_id as apartId,minb.block_name as block ,minam.cust_name as flat,
    mincdtl.cust_name,minsq1.site_id,
    (SELECT message_name FROM min_pushnotification_templates WHERE id=?)as title,
    (SELECT content FROM min_pushnotification_templates WHERE id=?)as message,
    mincdtl.id as compId
    FROM min_component_dtl as mincdtl
    INNER JOIN min_apart_master as minam ON mincdtl.apart_id = minam.id
    INNER JOIN min_block as minb ON minam.block_id= minb.id
    INNER JOIN min_site_qa1 as minsq1 ON minb.site_id =minsq1.site_id
    WHERE mincdtl.component_id=?`,
    listUserSession: `SELECT DISTINCT user_details.user_id,device_id as deviceId,push_token as pushToken
    FROM user_details
    JOIN user_token ON user_token.user_id = user_details.user_id
    where user_details.apartment_id = ? and user_token.isActive=1`,
    apartmentCompDayUsage: `SELECT
    cd.apart_id,
    sum(day_total) as day_total,
    cd.cust_name,
    cd.id,
    cd.component_id,
    DATE_FORMAT(dt, '%Y-%m-%d') as last_updated_date
    FROM min_component_dtl cd
    left  join mintixdb.min_component_day_total cdt on cd.apart_id = cdt.apart_id
    and cdt.dt >= ? and cdt.dt <=? and cd.component_id = cdt.comp_id
    left outer join min_apart_master am on  am.id = cdt.apart_id
    where cd.apart_id = ?
    group by cd.apart_id,component_id,dt`,
    componentList: `SELECT cd.cust_name,
    (CASE  WHEN cd.cust_name LIKE 'room1%' or cd.cust_name LIKE 'room2% 'END) as icon
    FROM mintixdb.min_component_dtl cd where cd.apart_id=?`,
    listFAQ: `
    SELECT category,faq.question as q, faq.answer as a FROM faq
    join faq_category faqc ON faqc.id = faq.category_id
    where faq.isActive = ? and faqc.isActive = ?`,
    getBlockInfo: `SELECT MB.id,MB.block_name,
    MB.is_under_maintenance,
    MB.maintenance_msg FROM min_block as MB
	join user_details ON user_details.block_id= MB.id
    join min_apart_master as w2a ON user_details.apartment_id= w2a.id
    WHERE user_details.user_id = ?`,
    listSessionApart: `
    SELECT DISTINCT user_details.user_id,device_id as deviceId,push_token as pushToken
    FROM user_details
    JOIN user_token ON user_token.user_id = user_details.user_id
    where user_details.apartment_id IN (:queryStr) and user_token.isActive=1`,
    smsTemplate: `
    select * from min_sms_templates where id = ? or message_name = ?`,
    verifyOTP: `SELECT * FROM mintixdb.otp
    where mobile_number=? and TIMESTAMPDIFF(minute, dt, now()) <=30 and verified = 'N'
    and otp =? order by dt desc limit 1`,
    chkUserExists: `SELECT username FROM mintixdb.users where username=?`,
    userDetailsExists: `select * from users
    inner join user_details ON user_details.user_id = users.profile_map_id
    where users.email = ? and user_details.mobile_no = ?`,
    checkPasswordExists: `select * from users where id = ?`
}
