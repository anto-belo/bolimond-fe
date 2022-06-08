import axios from "axios";

export class ProjectService {
    static getProjectOptions() {
        return axios.get('/project-options');
    }
}
