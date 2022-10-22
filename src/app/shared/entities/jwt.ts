type JsonWebToken = {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    userName: string,
    client_id: string,
    ".issued": string,
    ".expires": string
}