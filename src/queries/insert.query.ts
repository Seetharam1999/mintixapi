export const InsertQuery = {
    saveToken : `Insert into user_token
    (user_id,refresh_token,push_token,device_id,isActive,created_on,updated_on)
    values (?,?,?,?,1, current_timestamp(),current_timestamp())`,
    insertAlarmHistory: `Insert into w2_alarms
    (apart_id,comp_id,alarm_type,state,activeAlarm,dt)
    values(?,?,?,?,?, current_timestamp())`,
    insertFAQ: `insert into faq
    (category_id,question,answer,isActive)
    values ?`,
    insertOTP: `insert into otp (mobile_number,otp,verified,dt)
    values(?,?,?,current_timestamp())`,
    insertUser: `insert into users (username,nickname,email,password)
    values (?,?,?,?)`,
    insertUserDetails: `insert into user_details (user_id,user_name,email,mobile_no)
    values (?,?,?,?)`
}
