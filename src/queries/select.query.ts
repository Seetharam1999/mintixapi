export const SelectQuery={
getUserDetails:'select 1 as dummy',
loginCheck : `SELECT DISTINCT user_details.*,
    users.id,users.username,users.password,users.nickname,
    site_name,site_desc,site_address,block_name
    FROM users
    left join user_details on users.id = user_details.user_id
    left join mintix_site_qa1 on user_details.site_id = mintix_site_qa1.site_id
    left join mintix_block as w2b ON user_details.block_id= w2b.id
    left join mintix_apart_master as w2a ON user_details.apartment_id= w2a.id
    left join mintix_apart_properties as w2ap ON user_details.apartment_id= w2ap.apart_id
    WHERE username =? `,
validateToken: `SELECT * from user_token where user_id =? and isActive = 1 and refresh_Token = ? `,
 listUserSession: `
    SELECT DISTINCT user_details.user_id,device_id as deviceId,push_token as pushToken
    FROM user_details
    JOIN user_token ON user_token.user_id = user_details.user_id
    where user_details.apartment_id = ? and user_token.isActive=1`,
getBlockInfo: `
    SELECT w2b.id,w2b.block_name,
    w2b.is_under_maintenance,
    w2b.maintenance_msg FROM w2_block as w2b
	join user_details ON user_details.block_id= w2b.id
    join w2_apart_master as w2a ON user_details.apartment_id= w2a.id
    join user_token ON user_details.user_id= user_token.user_id
    WHERE user_details.user_id = ?`,
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
