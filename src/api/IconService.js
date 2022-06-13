import axios from "axios";
import Cookies from "js-cookie";

export class IconService {
    static getByPageOrdered(page, size) {
        return axios.get('/icons', {
            params: {
                page: page,
                size: size
            }
        });
    }

    static update(changeSet) {
        return axios.post('/admin/icons/update', changeSet, {
            headers: {
                Authorization: `Bearer ${Cookies.get('access-token')}`
            }
        });
    }
}
