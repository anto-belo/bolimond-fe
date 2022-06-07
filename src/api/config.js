import axios from "axios";
import Cookies from "js-cookie";
import {UserService} from "./UserService";

export const API_URL = 'http://localhost:8080';
export const MAX_FILE_BUNDLE_SIZE = 30 * 1024 * 1024; // 30 MB
export const JWT_SECRET = "YU13TGE5c3A1aEw1M1A1dXlEOW1VR3JQekEwaURm";
export const DEFAULT_PAGE_SIZE = 15;
export const Folder = {
    TEMPLATES: 'TEMPLATES',
    CUSTOM_PAGES: 'CUSTOM_PAGES',
    CUSTOM_PAGE_IMG: 'CUSTOM_PAGE_IMG',
    ICONS: 'ICONS',
    PROJECT_IMG: 'PROJECT_IMG',
    MAIN_PAGE_IMG: 'MAIN_PAGE_IMG'
};

axios.defaults.baseURL = API_URL;
axios.interceptors.response.use(null, error => {
    if (error.config && error.response && (error.response.status === 401 || error.response.status === 403)) {
        return UserService.refreshTokens().then(() => {
            error.config.headers.Authorization = Cookies.get('refresh-token')
            return axios.request(error.config);
        });
    }

    return Promise.reject(error);
});
