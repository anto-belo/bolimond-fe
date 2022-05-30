import axios from "axios";
import "./config"

export class PropertyService {
    static getProperties(page, size) {
        return axios.get('/admin/properties', {
            params: {
                page: page,
                size: size
            },
            // headers: {
            //     Authorization: `Bearer ${Cookies.get('access-token')}`
            // }
        })
    }

    static update(changeSet) {
        return axios.post('/admin/properties/update', changeSet, {
            // headers: {
            //     Authorization: `Bearer ${Cookies.get('access-token')}`
            // }
        })
    }
}
