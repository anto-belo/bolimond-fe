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

    static getSectionOptions() {
        return axios.get('/section-options');
    }

    static getCustomSectionTemplate(id) {
        return axios.get(`/sections/${id}/template`);
    }

    static update(changeSet) {
        return axios.post('admin/sections/update', changeSet, {
            withCredentials: true
        });
    }
}
