import axios from "axios";

export class DataBlockService {
    static getMainPageBlocksOrdered(page, size) {
        return axios.get('/main-page', {
            params: {
                page: page,
                size: size
            }
        });
    }

    static getProjectBlocksOrdered(page, size, id) {
        return axios.get(`/projects/${id}/blocks`, {
            params: {
                page: page,
                size: size
            }
        });
    }

    static updateMainPage(changeSet) {
        return axios.post('/admin/main-page/update', changeSet, {
            headers: {
                Authorization: `Bearer `
            }
        });
    }

    static updateProjectBlocks(id, changeSet) {
        return axios.post(`/admin/project/${id}/blocks/update`, changeSet, {
            headers: {
                Authorization: `Bearer `
            }
        });
    }
}
