import {useState} from 'react';
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import Section from "./Section";
import SectionEditor from "./SectionEditor";
import ResponsiveButtonBar from "../../../component/ResponsiveButtonBar";
import {SectionService} from "../../../api/SectionService";
import {checkBlankStringFields, checkUniqueByField} from "../../../util/validationUtils";
import {DEFAULT_PAGE_SIZE} from "../../../api/config";

const Sections = () => {
    const [sections, setSections]
        = useState([]);
    const [allLoaded, onLoadMore]
        = useEntityPageLoader(SectionService.getByPage, DEFAULT_PAGE_SIZE, sections, setSections);
    const [sectionUpdates, addSection, deleteSection, updateField, syncChanges]
        = useViewModel(sections, setSections, (markup) => {
            return {
                title: '',
                url: '',
                custom: !!markup,
                customMarkup: markup,
                seqPosition: sections.length + 1,
                active: true
            };
        }
    );

    /**
     * Returns custom section markup. In order to reduce service calls
     * amount, after the first call caches markup in cachedMarkup field
     * @param id section's id, which markup needs to be returned
     * @returns custom section markup
     */
    async function getCustomMarkup(id) {
        const section = sections.find(s => s.id === id);
        if (!section) return;
        if (!section.cachedMarkup && id > 0) {
            try {
                console.log('downloading...')
                section.cachedMarkup = (await SectionService.getCustomSection(id)).data;
            } catch (e) {
                e.response.status !== 404 && alert(e.message);
                return;
            }
        }
        return section.customMarkup || section.cachedMarkup;
    }

    function onApplyChanges() {
        const newSections = sections.filter(s => s.id < 0);
        if ((newSections.length === 0 && sectionUpdates.length === 0)
            || !newSections.every(s => checkBlankStringFields(s, ['title', 'url'], true))
            || !sectionUpdates.every(s => checkBlankStringFields(s, ['title', 'url'], false))) {
            alert("Nothing to update or some fields are blank");
            return;
        }
        if (!checkUniqueByField(sections, 'title') || !checkUniqueByField(sections, 'url')) {
            alert("Titles and URLs must be unique");
            return;
        }

        const changeSet = {};
        changeSet.newEntities = newSections.map(s => {
            const newSection = {
                title: s.title,
                url: s.url,
                seqPosition: s.seqPosition,
                active: s.active
            };
            if (s.customMarkup) {
                newSection.customMarkup = s.customMarkup;
            }
            return newSection;
        });

        changeSet.entityUpdates = sectionUpdates;

        SectionService.update(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                syncChanges(r.data);
            })
            .catch((e) => alert(e.message));
    }

    return (
        <AppContext.Provider value={{
            getCustomMarkup: getCustomMarkup,
            addSection: addSection,
            deleteSection: deleteSection,
            updateField: updateField
        }}>
            <SectionEditor/>
            <div className="row">
                <div className="col">
                    <h1>Content</h1>
                    <h2>Sections</h2>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th className='w-40'>Title</th>
                                <th className='w-40'>URL</th>
                                <th className='text-center'>Custom</th>
                                <th className='text-center w-10' style={{minWidth: '85px'}}>Order</th>
                                <th className='text-center'>Active</th>
                                <th className='text-center'>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sections
                                .sort((s1, s2) => s1.seqPosition - s2.seqPosition)
                                .map(s =>
                                    <Section key={s.id} id={s.id} title={s.title} url={s.url} custom={s.custom}
                                             seqPos={s.seqPosition} active={s.active} first={s.seqPosition === 1}
                                             last={s.seqPosition === sections.length}/>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <ResponsiveButtonBar onLoadMore={onLoadMore} onApplyChanges={onApplyChanges} allLoaded={allLoaded}>
                        <button className="btn btn-info" type="button" onClick={() => addSection(null)}>
                            <i className="fas fa-plus"/>&nbsp;Add category section
                        </button>
                        <button className="btn btn-info" type="button" data-bs-target="#section-editor-modal"
                                data-bs-toggle="modal">
                            <i className="fas fa-plus"/>&nbsp;Add custom section
                        </button>
                    </ResponsiveButtonBar>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default Sections;