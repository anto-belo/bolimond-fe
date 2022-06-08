import {useEffect, useState} from 'react';
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import {DataBlockService} from "../../../api/DataBlockService";
import {DEFAULT_PAGE_SIZE} from "../../../api/config";
import Slide from "./Slide";
import ResponsiveButtonBar from "../../../component/ResponsiveButtonBar";
import {checkBlankStringFields} from "../../../util/validationUtils";
import {CategoryService} from "../../../api/CategoryService";
import {ProjectService} from "../../../api/ProjectService";

const MainPageStructure = () => {
    const [slides, setSlides]
        = useState([]);
    const [slideUpdates, addSlide, deleteSlide, updateField, syncChanges, updateInitialPositions]
        = useViewModel(slides, setSlides, (type) => ({
            blockType: type,
            content: type === 'IMAGE' ? {url: ''} : '',
            seqPosition: slides.length + 1,
            additional: '',
            color: '000000',
            linkToProjectId: 0,
            fixed: false
        })
    );
    const [allLoaded, onLoadMore]
        = useEntityPageLoader(DataBlockService.getMainPageBlocksOrdered, DEFAULT_PAGE_SIZE, slides, setSlides,
        updateInitialPositions, dbEntity => {
            const entity = {
                ...dbEntity,
                color: '#' + dbEntity.blockConfig.color,
                linkToProjectId: dbEntity.blockConfig.linkToProjectId,
                fixed: dbEntity.blockConfig.fixed
            };
            delete entity.blockConfig;
            return entity;
        });

    const [projectOptions, setProjectOptions] = useState([]);
    useEffect(() => {
        ProjectService.getProjectOptions()
            .then((r) => setProjectOptions(r.data.map(p => ({...p, value: p.title}))))
            .catch((e) => alert(e.message));
    }, []);

    function onApplyChanges() {
        const newSlides = slides.filter(s => s.id < 0);
        if ((newSlides.length === 0 && slideUpdates.length === 0)
            || !newSlides.every(c => checkBlankStringFields(c, ['title', 'url'], true))
            || !slideUpdates.every(c => checkBlankStringFields(c, ['title', 'url'], false))) {
            alert("Nothing to update or some fields are blank");
            return;
        }

        const changeSet = {};
        changeSet.newEntities = newSlides.map(s => {
            const newSlide = {
                blockType: s.blockType,
                seqPosition: s.seqPosition,
                additional: s.additional,
                newBlockConfig: {
                    color: s.color,
                    linkToProjectId: s.linkToProjectId,
                    fixed: s.fixed
                }
            };
            newSlide.fileContent = s.blockType === 'IMAGE'
                ? s.fileContent.file
                : s.content;
            return newSlide;
        });

        changeSet.entityUpdates = slideUpdates;
        CategoryService.update(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                syncChanges(r.data);
            })
            .catch((e) => alert(e.response.data));
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
                            <th>Content</th>
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
                            deleteSlide: deleteSlide,
                            updateField: updateField,
                            projectOptions: projectOptions
                        }}>
                            {slides
                                .sort((s1, s2) => s1.seqPosition - s2.seqPosition)
                                .map(s =>
                                    <Slide key={s.id} id={s.id} type={s.blockType} content={s.content}
                                           seqPos={s.seqPosition} additional={s.additional} color={s.color}
                                           linkToProjectId={s.linkToProjectId} fixed={s.fixed}
                                           last={s.seqPosition === slides.length}/>
                                )}
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} onApplyChanges={onApplyChanges} allLoaded={allLoaded}>
                    <button className="btn btn-info text-white" type="button" onClick={() => addSlide('TEXT')}>
                        <i className="fas fa-file-alt"/>&nbsp;Add text slide
                    </button>
                    <button className="btn btn-info text-white" type="button" onClick={() => addSlide('IMAGE')}>
                        <i className="fas fa-image"/>&nbsp;Add image slide
                    </button>
                    <button className="btn btn-info text-white" type="button" onClick={() => addSlide('CODE')}>
                        <i className="fas fa-code"/>&nbsp;Add code slide
                    </button>
                </ResponsiveButtonBar>
            </div>
        </div>
    );
};

export default MainPageStructure;