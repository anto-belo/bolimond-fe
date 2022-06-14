import {useEffect, useState} from 'react';
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import Slide from "./Slide";
import {DataBlockService} from "../../../api/DataBlockService";
import {ProjectService} from "../../../api/ProjectService";
import {API_URL, DEFAULT_PAGE_SIZE, Folder} from "../../../api/config";
import ResponsiveButtonBar from "../../../component/ResponsiveButtonBar";
import ProcessingButtonSpinner from "../../../component/ProcessingButtonSpinner";

const dbEntityMapper = dbEntity => {
    const entity = {
        ...dbEntity,
        color: dbEntity["blockConfig"].color,
        linkToProjectId: dbEntity["blockConfig"].linkToProjectId,
        fixed: dbEntity["blockConfig"].fixed
    };
    if (dbEntity.blockType === 'IMAGE') {
        entity.content = {url: `${API_URL}/img/${Folder.MAIN_PAGE_IMG}/${entity.content}`};
    }
    delete entity["blockConfig"];
    return entity;
};

const MainPageStructure = () => {
    const [slides, setSlides] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [slideUpdates, addSlide, deleteSlide, updateField, syncChanges, updateInitialPositions]
        = useViewModel(slides, setSlides, (type) => ({
        blockType: type,
        content: type === 'IMAGE' ? {url: ''} : '',
        seqPosition: slides.length + 1,
        additional: '',
        color: '#000000',
        linkToProjectId: 0,
        fixed: false
    }));
    const [allLoaded, onLoadMore] = useEntityPageLoader(DataBlockService.getMainPageBlocksOrdered, DEFAULT_PAGE_SIZE,
        slides, setSlides, updateInitialPositions, dbEntityMapper);

    const [projectOptions, setProjectOptions] = useState([]);
    useEffect(() => {
        ProjectService.getProjectOptions()
            .then((r) => setProjectOptions(r.data))
            .catch((e) => alert(e.message));
    }, []);

    function onApplyChanges() {
        setProcessing(true);
        const newSlides = slides.filter(s => s.id < 0);
        slideUpdates.filter(u => !u.hasOwnProperty('delete')).forEach(u =>
            u.blockType = slides.find(s => s.id === u.id).blockType);

        if ((newSlides.length === 0 && slideUpdates.length === 0)
            || ![...slideUpdates.filter(s => s.hasOwnProperty('content')), ...newSlides]
                .every(s => {
                    return s.blockType === 'IMAGE'
                        ? s.hasOwnProperty('content') && s.content.hasOwnProperty('file')
                        : s.content.trim() !== ''
                })) {
            alert("Nothing to update or some fields are blank");
            setProcessing(false);
            return;
        }

        const changeSet = new FormData();
        newSlides.forEach((s, i) => {
            changeSet.append(`newEntities[${i}].blockType`, s.blockType);
            changeSet.append(`newEntities[${i}].seqPosition`, s.seqPosition);
            if (s.additional) changeSet.append(`newEntities[${i}].additional`, s.additional);
            changeSet.append(`newEntities[${i}].blockConfig.color`, s.color);
            if (s.linkToProjectId !== 0)
                changeSet.append(`newEntities[${i}].blockConfig.linkToProjectId`, s.linkToProjectId);
            changeSet.append(`newEntities[${i}].blockConfig.fixed`, s.fixed);
            if (s.content.hasOwnProperty('file')) {
                changeSet.append(`newEntities[${i}].fileContent`, s.content.file);
            } else {
                changeSet.append(`newEntities[${i}].content`, s.content);
            }
        });

        slideUpdates.forEach((u, i) => {
            changeSet.append(`entityUpdates[${i}].id`, u.id);
            if (u.hasOwnProperty('delete')) {
                changeSet.append(`entityUpdates[${i}].delete`, true);
                return;
            }

            if (u.hasOwnProperty('seqPosition'))
                changeSet.append(`entityUpdates[${i}].seqPosition`, u.seqPosition);
            if (u.hasOwnProperty('additional'))
                changeSet.append(`entityUpdates[${i}].additional`, u.additional);
            if (u.hasOwnProperty('color'))
                changeSet.append(`entityUpdates[${i}].blockConfig.color`, u.color);
            if (u.hasOwnProperty('linkToProjectId'))
                changeSet.append(`entityUpdates[${i}].blockConfig.linkToProjectId`, u.linkToProjectId);
            if (u.hasOwnProperty('fixed'))
                changeSet.append(`entityUpdates[${i}].blockConfig.fixed`, u.fixed);
            if (u.hasOwnProperty('content')) {
                if (u.blockType === 'IMAGE') {
                    changeSet.append(`entityUpdates[${i}].fileContent`, u.content.file);
                } else {
                    changeSet.append(`entityUpdates[${i}].content`, u.content);
                }
            }
        });

        DataBlockService.updateMainPage(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                setProcessing(false);
                syncChanges(r.data.map(e => dbEntityMapper(e)));
            })
            .catch((e) => {
                alert(e.message);
                setProcessing(false);
            });
    }

    return (
        <div className="row">
            <div className="col">
                <h1>Main page structure</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Type</th>
                            <th className='image-column'>Content</th>
                            <th>Color</th>
                            <th>Link to</th>
                            <th>Additional</th>
                            <th className='order-column'>Order</th>
                            <th>Fixed</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        <AppContext.Provider value={{
                            deleteEntity: deleteSlide,
                            updateField: updateField,
                            projectOptions: projectOptions,
                            firstOrdered: 1,
                            lastOrdered: slides.length
                        }}>
                            {slides
                                .sort((s1, s2) => s1.seqPosition - s2.seqPosition)
                                .map(s =>
                                    <Slide key={s.id} id={s.id} type={s.blockType} content={s.content}
                                           seqPos={s.seqPosition} additional={s.additional} color={s.color}
                                           linkToProjectId={s.linkToProjectId} fixed={s.fixed}/>
                                )}
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} allLoaded={allLoaded}>
                    <button className="btn btn-info text-white" type="button" onClick={() => addSlide('TEXT')}>
                        <i className="fas fa-file-alt"/>&nbsp;Add text slide
                    </button>
                    <button className="btn btn-info text-white" type="button" onClick={() => addSlide('IMAGE')}>
                        <i className="fas fa-image"/>&nbsp;Add image slide
                    </button>
                    <button className="btn btn-info text-white" type="button" onClick={() => addSlide('CODE')}>
                        <i className="fas fa-code"/>&nbsp;Add code slide
                    </button>
                    <button className="btn btn-success" type="button" onClick={onApplyChanges}>
                        <i className="fas fa-check"/>&nbsp;
                        <ProcessingButtonSpinner processing={processing} text='Apply changes'/>
                    </button>
                </ResponsiveButtonBar>
            </div>
        </div>
    );
};

export default MainPageStructure;