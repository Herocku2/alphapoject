type LoginAuthRequest = {
    email: string
    password: string
}

type RegisterCredentials = {
    username: string
    email: string
    password: string
    password2: string
    hcaptcha: string
}

type RegisterResponse = {
    message: string
}