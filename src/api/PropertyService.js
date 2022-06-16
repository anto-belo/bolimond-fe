import axios from "axios";
import "./config"

export class PropertyService {
    static getProperties(page, size) {
        return axios.get('/admin/properties', {
            params: {
                page: page,
                size: size
            },
            withCredentials: true
        });
    }

    static update(changeSet) {
        return axios.post('/admin/properties/update', changeSet, {
            withCredentials: true
        });
    }
}
