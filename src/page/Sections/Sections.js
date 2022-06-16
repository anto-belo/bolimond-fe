import {useState} from 'react';
import {useEntityPageLoader} from "../../hook/useEntityPageLoader";
import {useViewModel} from "../../hook/useViewModel";
import {AppContext} from "../../context/AppContext";
import Section from "./Section";
import SectionEditor from "./SectionEditor";
import ResponsiveButtonBar from "../../component/ResponsiveButtonBar";
import ProcessingButtonSpinner from "../../component/ProcessingButtonSpinner";
import {SectionService} from "../../api/SectionService";
import {checkBlankStringFields, checkUniqueByField} from "../../util/validationUtils";
import {DEFAULT_PAGE_SIZE} from "../../api/config";

const Sections = () => {
    const [sections, setSections] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [sectionUpdates, addSection, deleteSection, updateField, syncChanges, updateInitialPositions]
        = useViewModel(sections, setSections, (markup) => {
        return {
            title: '',
            url: '',
            seqPosition: sections.length + 1,
            active: true,
            custom: !!markup,
            customMarkup: markup,
            removable: true
        };
    });
    const [allLoaded, onLoadMore] = useEntityPageLoader(SectionService.getByPageOrdered, DEFAULT_PAGE_SIZE,
        sections, setSections, updateInitialPositions);

    /**
     * Returns custom section markup. In order to reduce service calls amount,
     * after the first call function caches markup in 'cachedMarkup' field
     * @param id section's id, which markup needs to be returned
     * @returns custom section markup
     */
    async function getCustomMarkup(id) {
        const section = sections.find(s => s.id === id);
        if (!section) return;
        if (!section.cachedMarkup && id > 0) {
            try {
                section.cachedMarkup = (await SectionService.getCustomSectionTemplate(id)).data;
            } catch (e) {
                e.response.status !== 404 && alert(e.message);
                return;
            }
        }
        return section.customMarkup || section.cachedMarkup;
    }

    function onApplyChanges() {
        setProcessing(true);
        const newSections = sections.filter(s => s.id < 0);
        if ((newSections.length === 0 && sectionUpdates.length === 0)
            || !newSections.every(s => checkBlankStringFields(s, ['title', 'url'], true))
            || !sectionUpdates.every(s => checkBlankStringFields(s, ['title', 'url'], false))) {
            alert("Nothing to update or some fields are blank");
            setProcessing(false);
            return;
        }
        if (!checkUniqueByField(sections, 'title') || !checkUniqueByField(sections, 'url')) {
            alert("Titles and URLs must be unique");
            setProcessing(false);
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
            addSection: addSection,
            deleteEntity: deleteSection,
            updateField: updateField,
            getCustomMarkup: getCustomMarkup,
            firstOrdered: 1,
            lastOrdered: sections.length
        }}>
            <SectionEditor/>
            <div className="row">
                <div className="col">
                    <h1>Sections</h1>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>URL</th>
                                <th>Custom</th>
                                <th style={{minWidth: '120px'}}>Order</th>
                                <th>Active</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sections
                                .sort((s1, s2) => s1.seqPosition - s2.seqPosition)
                                .map(s =>
                                    <Section key={s.id} id={s.id} title={s.title} url={s.url} custom={s.custom}
                                             seqPos={s.seqPosition} active={s.active} removable={s.removable}/>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <ResponsiveButtonBar onLoadMore={onLoadMore} allLoaded={allLoaded}>
                        <button className="btn btn-info text-white" type="button" onClick={() => addSection(null)}>
                            <i className="fas fa-plus"/>&nbsp;Add category section
                        </button>
                        <button className="btn btn-info text-white" type="button"
                                data-bs-target="#section-editor-modal"
                                data-bs-toggle="modal">
                            <i className="fas fa-plus"/>&nbsp;Add custom section
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

export default Sections;