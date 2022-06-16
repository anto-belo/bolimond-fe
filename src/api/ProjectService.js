import axios from "axios";

export class ProjectService {
    static getByPageOrdered(page, size) {
        return axios.get('/projects', {
            params: {
                page: page,
                size: size
            }
        });
    }

    static getProject(id) {
        return axios.get(`/project/${id}`);
    }

    static getProjectOptions() {
        return axios.get('/project-options');
    }

    static save(newProjectDto) {
        return axios.post('/admin/project/save', newProjectDto, {
            withCredentials: true
        });
    }

    static update(changeSet) {
        return axios.post('/admin/projects/update', changeSet, {
            withCredentials: true
        });
    }
}
