export interface LoginAuth {
    alternate_email_id: string,
    password: string,
    source?: string,
    logout_from_all_devices?: boolean
}
