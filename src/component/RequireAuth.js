import Cookies from "js-cookie";
import {AuthContext} from "../context/AuthContext";
import {UserService} from "../api/UserService";
import {API_URL, AUTH_USERNAME_COOKIE} from "../api/config";
import {useEffect} from "react";
import axios from "axios";
import {TokenService} from "../api/TokenService";

const REFRESH_NOT_FOUND_MSG = 'REFRESH_NOT_FOUND';

const RequireAuth = ({children}) => {
    useEffect(() => {
        axios.interceptors.response.use(r => r, error => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                if (error.response.data === REFRESH_NOT_FOUND_MSG) {
                    Cookies.remove(AUTH_USERNAME_COOKIE);
                    window.location.replace(`${API_URL}/login`);
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
    }, []);

    let username = Cookies.get(AUTH_USERNAME_COOKIE);

    if (!username) {
        TokenService.refreshTokens()
            .then(() => username = Cookies.get(AUTH_USERNAME_COOKIE))
            .catch(() => window.location.replace(`${API_URL}/login`));
    }

    let user = {};
    UserService.getByUsername(username)
        .then(r => user = r.data);

    return (
        <AuthContext.Provider value={{authUser: user}}>
            {children}
        </AuthContext.Provider>
    );
};

export default RequireAuth;