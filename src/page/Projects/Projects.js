import {useEffect, useState} from "react";
import {useEntityPageLoader} from "../../hook/useEntityPageLoader";
import {useViewModel} from "../../hook/useViewModel";
import {AppContext} from "../../context/AppContext";
import Project from "./Project";
import ProjectStructure from "./ProjectStructure/ProjectStructure";
import ResponsiveButtonBar from "../../component/ResponsiveButtonBar";
import {ProjectService} from "../../api/ProjectService";
import {CategoryService} from "../../api/CategoryService";
import {checkBlankStringFields} from "../../util/validationUtils";
import {DEFAULT_PAGE_SIZE} from "../../api/config";
import ProcessingButtonSpinner from "../../component/ProcessingButtonSpinner";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [projectUpdates, addProject, deleteProject, updateField, syncChanges, updateInitialPositions]
        = useViewModel(projects, setProjects, (id, title, url, categoryId, color, keyWords) => ({
        id: id,
        title: title,
        url: url,
        categoryId: categoryId,
        color: color,
        keyWords: keyWords,
        seqPosition: projects.length + 1,
        active: true,
        fixed: false
    }));
    const [allLoaded, onLoadMore] = useEntityPageLoader(ProjectService.getByPageOrdered, DEFAULT_PAGE_SIZE,
        projects, setProjects, updateInitialPositions);

    const [categoryOptions, setCategoryOptions] = useState([]);
    useEffect(() => {
        CategoryService.getCategoryOptions()
            .then((r) => setCategoryOptions(r.data))
            .catch((e) => alert(e.message));
    }, []);

    function onApplyChanges() {
        setProcessing(true);
        if (projects.some(c => c.categoryId === 0)) {
            alert("All projects must be assigned to categories");
            setProcessing(false);
            return;
        }

        if (projectUpdates.length === 0
            || !projectUpdates.every(c => checkBlankStringFields(c, ['title', 'url', 'keyWords'], false))) {
            alert("Nothing to update or some fields are blank");
            setProcessing(false);
            return;
        }

        const changeSet = {
            entityUpdates: projectUpdates
        };
        ProjectService.update(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                setProcessing(false);
                syncChanges(r.data);
            })
            .catch((e) => {
                alert(e.response.data);
                setProcessing(false);
            });
    }

    return (
        <AppContext.Provider value={{
            addProject: addProject,
            deleteEntity: deleteProject,
            updateField: updateField,
            categoryOptions: categoryOptions,
            nextSeqPosition: projects.length + 1,
            firstOrdered: 1,
            lastOrdered: projects.length
        }}>
            <ProjectStructure/>
            <div className="row">
                <div className="col">
                    <h1>Projects</h1>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>URL</th>
                                <th>Category</th>
                                <th>Color</th>
                                <th>Keywords</th>
                                <th className='order-column'>Order</th>
                                <th>Active</th>
                                <th>Fixed</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {projects
                                .sort((p1, p2) => p1.seqPosition - p2.seqPosition)
                                .map(p =>
                                    <Project key={p.id} id={p.id} title={p.title} url={p.url}
                                             categoryId={p.categoryId} color={p.color} keyWords={p.keyWords}
                                             seqPos={p.seqPosition} active={p.active} fixed={p.fixed}/>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <ResponsiveButtonBar onLoadMore={onLoadMore} allLoaded={allLoaded}>
                        <button className="btn btn-info text-white" type="button" data-bs-target="#project-editor-modal"
                                data-bs-toggle="modal">
                            <i className="fas fa-plus"/>&nbsp;Add project
                        </button>
                        <button className="btn btn-success" type="button" onClick={onApplyChanges}>
                            <i className="fas fa-check"/>&nbsp;
                            <ProcessingButtonSpinner processing={processing} text='Apply changes'/>
                        </button>
                    </ResponsiveButtonBar>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default Projects;