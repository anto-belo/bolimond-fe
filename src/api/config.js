import axios from "axios";
import Cookies from "js-cookie";
import {UserService} from "./UserService";

axios.defaults.baseURL = 'http://localhost:8080'

axios.interceptors.response.use(null, error => {
    if (error.config && error.response && (error.response.status === 401 || error.response.status === 403)) {
        return UserService.refreshTokens().then(() => {
            error.config.headers.Authorization = Cookies.get('refresh-token')
            return axios.request(error.config);
        });
    }

    return Promise.reject(error);
});

export const JWT_SECRET = "YU13TGE5c3A1aEw1M1A1dXlEOW1VR3JQekEwaURm";
export const DEFAULT_PAGE_SIZE = 15;
