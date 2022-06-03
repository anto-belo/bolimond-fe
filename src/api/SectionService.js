import axios from "axios";

export class SectionService {
    static getByPage(page, size) {
        return axios.get('/sections', {
            params: {
                page: page,
                size: size
            }
        });
    }

    static update(changeSet) {
        return axios.post('admin/sections/update', changeSet, {
            // headers: {
            //     Authorization: `Bearer ${Cookies.get('access-token')}`
            // }
        });
    }
}
