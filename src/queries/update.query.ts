export const UpdateQuery = {
    invalidateToken : `update user_token set isActive=0 where refresh_token = ? and user_id = ?`,
    resetAlarm: `update w2_alarms
    set activeAlarm = 0 where apart_id = ? and comp_id = ? and alarm_type = ?
    and state = ? and activeAlarm = ?`,
    setVerifiedOTP: `update otp set verified = 'Y'
    where id = ?`,
    updatePassword: `update users set password = ? where id = ?`,
    updateDeviceInfo: `update user_token set push_token = ? , device_id = ? where refresh_token = ? and user_id = ?`,
}
