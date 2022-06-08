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

    static updateMainPage(changeSet) {
        return axios.post('/admin/main-page/update', changeSet, {
            headers: {
                Authorization: `Bearer `
            }
        });
    }
}
