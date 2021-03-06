import {useContext, useEffect, useRef, useState} from 'react';
import {useViewModel} from "../../../hook/useViewModel";
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {AppContext} from "../../../context/AppContext";
import Block from "./Block";
import ResponsiveButtonBar from "../../../component/ResponsiveButtonBar";
import {DataBlockService} from "../../../api/DataBlockService";
import {ProjectService} from "../../../api/ProjectService";
import {API_URL, DEFAULT_PAGE_SIZE, Folder} from "../../../api/config";
import ProcessingButtonSpinner from "../../../component/ProcessingButtonSpinner";

const dbEntityMapper = dbEntity => {
    const entity = {...dbEntity};
    if (dbEntity.blockType === 'IMAGE' || dbEntity.blockType === 'TITLE') {
        entity.content = {url: `${API_URL}/img/${Folder.PROJECT_IMG}/${entity.content}`};
    }
    return entity;
};

const initialBlocks = [
    {
        id: -1,
        blockType: 'TITLE',
        content: {url: ''},
        seqPosition: 1,
        additional: ''
    }
];

const ProjectStructure = () => {
    const appContext = useContext(AppContext);

    const [blocks, setBlocks] = useState([]);
    const [processing, setProcessing] = useState(false);

    const [id, setId] = useState(null);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [keyWords, setKeyWords] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    const [color, setColor] = useState('#000000');

    const modalRef = useRef(null);
    const closeButton = useRef(null);

    const [blockUpdates, addBlock, deleteBlock, updateField, syncChanges, updateInitialPositions]
        = useViewModel(blocks, setBlocks, (id, type) => ({
        blockType: type,
        projectId: id,
        content: type === 'IMAGE' ? {url: ''} : '',
        seqPosition: blocks.length + 1,
        additional: ''
    }));

    const [allLoaded, onLoadMore, changeGetter] = useEntityPageLoader(
        (page, size) => DataBlockService.getProjectBlocksOrdered(page, size, id), DEFAULT_PAGE_SIZE,
        blocks, setBlocks, updateInitialPositions, dbEntityMapper);

    const [projectOptions, setProjectOptions] = useState([]);
    useEffect(() => {
        ProjectService.getProjectOptions()
            .then((r) => setProjectOptions(r.data))
            .catch((e) => alert(e.message));
    }, []);

    useEffect(() => {
        function onShowModal(e) {
            const projectId = Number(e.relatedTarget.getAttribute('data-bs-project-id'));
            setId(projectId);
            if (projectId) {
                changeGetter((page, size) => DataBlockService.getProjectBlocksOrdered(page, size, projectId));
            } else {
                setBlocks(initialBlocks);
            }
            setTitle(e.relatedTarget.getAttribute('data-bs-project-title'));
        }

        (modalRef.current: HTMLDivElement).addEventListener('show.bs.modal', onShowModal);
        return () => (modalRef.current: HTMLDivElement)?.removeEventListener('show.bs.modal', onShowModal)
    }, []);

    useEffect(() => {
        function onHiddenModal() {
            setId(null);
            setTitle('');
            setUrl('');
            setKeyWords('');
            setCategoryId(0);
            setColor('#000000');
            setBlocks([]);
        }

        (modalRef.current: HTMLDivElement).addEventListener('hidden.bs.modal', onHiddenModal);
        return () => (modalRef?.current: HTMLDivElement)?.removeEventListener('hidden.bs.modal', onHiddenModal)
    }, []);

    function onApplyChanges() {
        setProcessing(true);
        const newBlocks = blocks.filter(b => b.id < 0);
        blockUpdates.filter(u => !u.hasOwnProperty('delete')).forEach(u => {
            u.blockType = blocks.find(b => b.id === u.id).blockType
        });

        const anyEmptyGeneralInfo = id ? false
            : title?.trim() === '' || url?.trim() === '' || keyWords?.trim() === '' || categoryId === 0;
        const noChanges = newBlocks.length === 0 && blockUpdates.length === 0;
        const anyContentEmpty = ![...blockUpdates.filter(s => s.hasOwnProperty('content')), ...newBlocks]
            .every(b => b.blockType === 'IMAGE' || b.blockType === 'TITLE'
                ? b.hasOwnProperty('content') && b.content.hasOwnProperty('file')
                : b.content.trim() !== '');
        const anyProjectIdEmpty = !id ? false
            : ![...blockUpdates.filter(s => s.hasOwnProperty('projectId')), ...newBlocks]
                .every(b => b.projectId !== 0);

        if (anyEmptyGeneralInfo || noChanges || anyContentEmpty || anyProjectIdEmpty) {
            alert("Nothing to update or some fields are blank");
            setProcessing(false);
            return;
        }

        (id
            ? DataBlockService.updateProjectBlocks(id, updateProjectFormData(newBlocks))
            : ProjectService.save(newProjectFormData(newBlocks)))
            .then((r) => {
                const savedProjectId = Number(r.data);
                alert("Changes successfully saved");
                syncChanges();
                setProcessing(false);
                if (!id) {
                    appContext.addProject(savedProjectId, title, url, categoryId, color, keyWords);
                    setProjectOptions([...projectOptions, {id: savedProjectId, value: title}]);
                    (closeButton.current: HTMLButtonElement).click();
                }
            })
            .catch((e) => {
                alert(e.response.data);
                setProcessing(false);
            });
    }

    function newProjectFormData(newBlocks) {
        const data = new FormData();
        if (!id) {
            data.append('title', title);
            data.append('url', url);
            data.append('categoryId', categoryId);
            data.append('color', color);
            data.append('keyWords', keyWords);
            data.append('seqPosition', appContext.nextSeqPosition);
            data.append('active', true);
            data.append('fixed', false);
            newBlocks.forEach((b, i) => {
                data.append(`dataBlocks[${i}].blockType`, b.blockType);
                data.append(`dataBlocks[${i}].seqPosition`, b.seqPosition);
                if (b.additional) data.append(`dataBlocks[${i}].additional`, b.additional);
                if (b.blockType === 'IMAGE' || b.blockType === 'TITLE') {
                    data.append(`dataBlocks[${i}].fileContent`, b.content.file);
                } else {
                    data.append(`dataBlocks[${i}].content`, b.content);
                }
            });
        }
        return data;
    }

    function updateProjectFormData(newBlocks) {
        const data = new FormData();
        newBlocks.forEach((b, i) => {
            data.append(`newEntities[${i}].blockType`, b.blockType);
            data.append(`newEntities[${i}].seqPosition`, b.seqPosition);
            if (b.additional) data.append(`newEntities[${i}].additional`, b.additional);
            if (b.blockType === 'IMAGE' || b.blockType === 'TITLE') {
                data.append(`newEntities[${i}].fileContent`, b.content.file);
            } else {
                data.append(`newEntities[${i}].content`, b.content);
            }
        });

        blockUpdates.forEach((u, i) => {
            data.append(`entityUpdates[${i}].id`, u.id);
            if (u.hasOwnProperty('delete')) {
                data.append(`entityUpdates[${i}].delete`, true);
                return;
            }

            if (u.hasOwnProperty('projectId'))
                data.append(`entityUpdates[${i}].projectId`, u.projectId);
            if (u.hasOwnProperty('seqPosition'))
                data.append(`entityUpdates[${i}].seqPosition`, u.seqPosition);
            if (u.hasOwnProperty('additional'))
                data.append(`entityUpdates[${i}].additional`, u.additional);
            if (u.hasOwnProperty('content')) {
                if (u.blockType === 'IMAGE' || u.blockType === 'TITLE') {
                    data.append(`entityUpdates[${i}].fileContent`, u.content.file);
                } else {
                    data.append(`entityUpdates[${i}].content`, u.content);
                }
            }
        });
        return data;
    }

    return (
        <div ref={modalRef} id="project-editor-modal" className="modal fade" role="dialog" tabIndex="-1">
            <div className="modal-dialog modal-fullscreen" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Edit project structure {title && `(${title})`}</h4>
                        <button ref={closeButton} className="btn-close" type="button" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            {!id && <>
                                <div className="row">
                                    <div className="col">
                                        <h3>General info</h3>
                                    </div>
                                </div>
                                <div className="row row-cols-1 row-cols-sm-2 my-4">
                                    <div className="col">
                                        <div className="input-group">
                                            <span className="input-group-text">Title</span>
                                            <input className="form-control" type="text" value={title || ''}
                                                   onChange={(e) => setTitle(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="col mt-4 mt-sm-0">
                                        <div className="input-group">
                                            <span className="input-group-text">URL</span>
                                            <input className="form-control" type="text" value={url || ''}
                                                   onChange={(e) => setUrl(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row row-cols-1 row-cols-lg-2 my-4">
                                    <div className="col">
                                        <div className="input-group">
                                            <span className="input-group-text">Key words</span>
                                            <input className="form-control" type="text" value={keyWords || ''}
                                                   onChange={(e) => setKeyWords(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div
                                        className="col d-flex flex-column justify-content-between flex-sm-row mt-4 mt-lg-0">
                                        <div className="flex-grow-1 me-sm-4">
                                            <div className="input-group">
                                                <span className="input-group-text">Category</span>
                                                <select className="form-select" value={categoryId}
                                                        onChange={(e) =>
                                                            setCategoryId(Number(e.target.value))}>
                                                    <option value="0"></option>
                                                    {appContext.categoryOptions.map(c =>
                                                        <option key={c.id} value={c.id}>{c.value}</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-4 mt-sm-0">
                                            <div className="input-group">
                                            <span className="input-group-text py-1">
                                                Color&nbsp;<input type="color" value={color}
                                                                  onChange={(e) => setColor(e.target.value)}/>
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h3>Project structure</h3>
                            </>}
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th className='w-25'>Content</th>
                                        <th>Additional</th>
                                        {!!id && <th>Project</th>}
                                        <th className='order-column'>Order</th>
                                        <th>Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <AppContext.Provider value={{
                                        deleteEntity: deleteBlock,
                                        updateField: updateField,
                                        projectOptions: projectOptions,
                                        firstOrdered: 1,
                                        lastOrdered: blocks.length
                                    }}>
                                        {blocks
                                            .sort((b1, b2) => b1.seqPosition - b2.seqPosition)
                                            .map(b =>
                                                <Block key={b.id} id={b.id} type={b.blockType}
                                                       projectId={b.projectId} content={b.content}
                                                       seqPos={b.seqPosition} additional={b.additional}
                                                       isNewProject={!id}/>
                                            )}
                                    </AppContext.Provider>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <ResponsiveButtonBar onLoadMore={onLoadMore} allLoaded={allLoaded}>
                            <button className="btn btn-info text-white" type="button"
                                    onClick={() => addBlock(id, 'TEXT')}>
                                <i className="fas fa-file-alt"/>&nbsp;Add text slide
                            </button>
                            <button className="btn btn-info text-white" type="button"
                                    onClick={() => addBlock(id, 'IMAGE')}>
                                <i className="fas fa-image"/>&nbsp;Add image slide
                            </button>
                            <button className="btn btn-info text-white" type="button"
                                    onClick={() => addBlock(id, 'CODE')}>
                                <i className="fas fa-code"/>&nbsp;Add code slide
                            </button>
                            <button className="btn btn-success" type="button" onClick={onApplyChanges}>
                                <i className="fas fa-check"/>&nbsp;
                                <ProcessingButtonSpinner processing={processing} text='Apply changes'/>
                            </button>
                        </ResponsiveButtonBar>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectStructure;