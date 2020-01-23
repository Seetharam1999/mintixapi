export const UpdateQuery = {
    invalidateToken : `update user_token set isActive=0 where refresh_token = ? and user_id = ?`,
    setVerifiedOTP: `update otp set verified = 'Y'
    where id = ?`,
    updatePassword: `update users set password = ? where id = ?`,
    updateDeviceInfo: `update user_token set push_token = ? , device_id = ? where refresh_token = ? and user_id = ?`,
}
