import axios from "axios";

export class FileService {
    static getCustomPagesImagesByPage(page, size) {
        return axios.get('/admin/fs/custom/img', {
            params: {
                page: page,
                size: size
            },
            // headers: {
            //     Authorization: `Bearer `
            // }
        });
    }

    static uploadCustomPageImages(files) {
        files = [...files];
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }

        return axios.post('/admin/fs/custom/img/upload', data, {
            // headers: {
            //     Authorization: `Bearer `
            // }
        });
    }

    static deleteCustomPagesImage(fileName) {
        return axios.delete('/admin/fs/custom/img/delete', {
            params: {
                fileName: fileName
            }
            // headers: {
            //     Authorization: `Bearer `
            // }
        });
    }
}
