import axios from "axios";

export class SectionService {
    static getByPageOrdered(page, size) {
        return axios.get('/sections', {
            params: {
                page: page,
                size: size
            }
        });
    }

    static getCustomSection(id) {
        return axios.get(`/sections/${id}/markup`);
    }

    static getSectionOptions() {
        return axios.get('/section-options');
    }

    static update(changeSet) {
        return axios.post('admin/sections/update', changeSet, {
            // headers: {
            //     Authorization: `Bearer ${Cookies.get('access-token')}`
            // }
        });
    }
}
