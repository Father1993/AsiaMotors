export interface LeadParams extends Record<string, unknown> {
    form_name: string
    user_name: string
    user_phone: string
    user_city?: string
    car_model?: string
    message?: string
}
