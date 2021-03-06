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

    static getCategoryOptions() {
        return axios.get('/category-options');
    }

    static update(changeSet) {
        return axios.post('admin/categories/update', changeSet, {
            withCredentials: true
        });
    }
}
