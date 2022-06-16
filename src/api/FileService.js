import axios from "axios";

export class FileService {
    static getCustomPagesImagesByPage(page, size) {
        return axios.get('/admin/fs/custom/img', {
            params: {
                page: page,
                size: size
            },
            withCredentials: true
        });
    }

    static uploadCustomPageImages(files) {
        files = [...files];
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }

        return axios.post('/admin/fs/custom/img/upload', data, {
            withCredentials: true
        });
    }

    static deleteCustomPagesImage(fileName) {
        return axios.delete('/admin/fs/custom/img/delete', {
            params: {
                fileName: fileName
            },
            withCredentials: true
        });
    }
}
