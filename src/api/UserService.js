import axios from "axios";
import Cookies from "js-cookie";
import {jwtVerify} from "jose";
import {JWT_SECRET} from "./config";

const ACCESS_TOKEN_COOKIE = 'access-token';
const REFRESH_TOKEN_COOKIE = 'refresh-token';

export class UserService {
    static getByPage(page, size) {
        return axios.get('/admin/users', {
            params: {
                page: page,
                size: size
            },
            headers: {
                Authorization: `Bearer ${Cookies.get('access-token')}`
            }
        });
    }

    static update(changeSet) {
        return axios.post('admin/users/update', changeSet, {
            headers: {
                Authorization: `Bearer ${Cookies.get('access-token')}`
            }
        });
    }

    static updatePassword(userId, oldPassword, newPassword) {
        return axios.post('/users/update/password', {
            id: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    }

    static login(username, password) {
        let credentials = new URLSearchParams();
        credentials.set("username", username);
        credentials.set("password", password);
        return axios.post('/login', credentials);
    }

    static logout(refreshToken) {
        return axios.post('/admin/logout', {}, {
            params: {
                refreshToken: refreshToken
            }
        });
    }

    static refreshTokens() {
        return axios.get('/tokens/refresh', {
            headers: {
                'Refresh-Token': Cookies.get(REFRESH_TOKEN_COOKIE)
            }
        });
    }

    static getAccessToken() {
        const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
        try {
            jwtVerify(accessToken, JWT_SECRET)
                .then(r => {
                    console.log(r.payload);
                    console.log(r.protectedHeader);
                });
        } catch (err) {
            try {
                // jwt.verify(refreshToken, JWT_SECRET, null, null);
                this.refreshTokens(refreshToken)
                    .then(() => {
                        return Cookies.get(ACCESS_TOKEN_COOKIE);
                    })
            } catch (err) {
                return null;
            }
        }
    }

}
