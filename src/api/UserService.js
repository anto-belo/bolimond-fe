import axios from "axios";

export class UserService {
    static getByPage(page, size) {
        return axios.get('/admin/users', {
            params: {
                page: page,
                size: size
            },
            withCredentials: true
        });
    }

    static getByUsername(username) {
        return axios.get(`/admin/user/${username}`, {
            withCredentials: true
        });
    }

    static update(changeSet) {
        return axios.post('/admin/users/update', changeSet, {
            withCredentials: true
        });
    }

    static updatePassword(userId, oldPassword, newPassword) {
        return axios.post('/users/update/password', {
            id: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    }
}
