import axios from "axios";

export class CategoryService {
    static getByPageOrdered(page, size) {
        return axios.get('/categories', {
            params: {
                page: page,
                size: size
            }
        });
    }

    static update(changeSet) {
        return axios.post('admin/categories/update', changeSet, {
            // headers: {
            //     Authorization: `Bearer ${Cookies.get('access-token')}`
            // }
        });
    }
}
