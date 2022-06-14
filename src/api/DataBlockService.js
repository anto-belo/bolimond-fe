import axios from "axios";
import Cookies from "js-cookie";

export class DataBlockService {
    static getMainPageBlocksOrdered(page, size) {
        return axios.get('/main-page/blocks', {
            params: {
                page: page,
                size: size
            }
        });
    }

    static getProjectBlocksOrdered(page, size, id) {
        if (!id) return new Promise(resolve => resolve({data: []}));

        return axios.get(`/projects/${id}/blocks`, {
            params: {
                page: page,
                size: size
            }
        });
    }

    static updateMainPage(changeSet) {
        return axios.post('/admin/main-page/blocks/update', changeSet, {
            headers: {
                Authorization: `Bearer ${Cookies.get('access-token')}`
            }
        });
    }

    static updateProjectBlocks(id, changeSet) {
        return axios.post(`/admin/project/${id}/blocks/update`, changeSet, {
            headers: {
                Authorization: `Bearer ${Cookies.get('access-token')}`
            }
        });
    }
}
