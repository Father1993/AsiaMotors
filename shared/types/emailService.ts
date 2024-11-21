export interface EmailConfig {
    serviceId: string
    templateId: string
    publicKey: string
}

export interface EmailTemplateParams extends Record<string, unknown> {
    form_name: string
    user_name: string
    user_phone: string
    user_city?: string
    car_model?: string
    message?: string
}
