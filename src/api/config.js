import axios from "axios";

export const API_URL = 'http://localhost:8080';
export const AUTH_USERNAME_COOKIE = "auth-username";
export const MAX_FILE_BUNDLE_SIZE = 30 * 1024 * 1024; // 30 MB
export const MAX_IMAGE_BLOCK_SIZE = 5 * 1024 * 1024; // 5 MB
export const DEFAULT_PAGE_SIZE = 15;
export const Folder = {
    CUSTOM_PAGE_IMG: 'CUSTOM_PAGE_IMG',
    ICONS: 'ICONS',
    PROJECT_IMG: 'PROJECT_IMG',
    MAIN_PAGE_IMG: 'MAIN_PAGE_IMG'
};

axios.defaults.baseURL = API_URL;

