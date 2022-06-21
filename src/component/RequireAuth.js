import Cookies from "js-cookie";
import {AuthContext} from "../context/AuthContext";
import {UserService} from "../api/UserService";
import {API_URL, AUTH_USERNAME_COOKIE} from "../api/config";
import {useEffect, useState} from "react";
import axios from "axios";
import {TokenService} from "../api/TokenService";

const REFRESH_ERROR_MSG = 'REFRESH_ERROR';

const RequireAuth = ({children}) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        axios.interceptors.response.use(r => r, error => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                if (error.response.data === REFRESH_ERROR_MSG) {
                    Cookies.remove(AUTH_USERNAME_COOKIE);
                    window.location.replace(`${API_URL}/login`);
                    return;
                }
                return TokenService.refreshTokens()
                    .then(() => {
                        return axios.request(error.config);
                    })
                    .catch(() => {
                        Cookies.remove(AUTH_USERNAME_COOKIE);
                        window.location.replace(`${API_URL}/login`)
                    });
            }

            return Promise.reject(error);
        });

        let username = Cookies.get(AUTH_USERNAME_COOKIE);

        if (!username) {
            TokenService.refreshTokens()
                .then(() => username = Cookies.get(AUTH_USERNAME_COOKIE))
                .catch(() => window.location.replace(`${API_URL}/login`));
        }

        UserService.getByUsername(username)
            .then(r => setUser(r.data));
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};

export default RequireAuth;