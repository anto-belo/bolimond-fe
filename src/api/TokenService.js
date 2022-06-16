import axios from "axios";

export class TokenService {
    static logout() {
        return axios.post('/logout', null, {
            withCredentials: true
        });
    }

    static refreshTokens() {
        return axios.post('/tokens/refresh', null, {withCredentials: true});
    }
}
