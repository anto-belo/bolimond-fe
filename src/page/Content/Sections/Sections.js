import React, {useState} from 'react';
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import Section from "./Section";
import ResponsiveButtonBar from "../../../component/ResponsiveButtonBar";
import {SectionService} from "../../../api/SectionService";
import {checkBlankStringFields, checkUniqueByField} from "../../../util/validationUtils";
import {DEFAULT_PAGE_SIZE} from "../../../api/config";

const Sections = () => {
    const [sections, setSections]
        = useState([]);
    const [allLoaded, onLoadMore]
        = useEntityPageLoader(SectionService.getByPage, DEFAULT_PAGE_SIZE, sections, setSections);
    const [sectionUpdates, addSection, deleteSection, updateField, resetUpdates, moveUp, moveDown]
        = useViewModel(sections, setSections, (custom) => {
            return {
                title: '',
                url: '',
                custom: custom,
                seqPosition: sections.length + 1,
                active: true
            };
        }
    );

    const addButtons = [
        {
            title: 'Add category section',
            callback: () => addSection(false)
        },
        {
            title: 'Add custom section',
            callback: () => addSection(true)
        }
    ];

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
            return {
                title: s.title,
                url: s.url,
                seqPosition: s.seqPosition,
                active: s.active
            };
        });

        changeSet.entityUpdates = sectionUpdates;

        SectionService.update(changeSet)
            .then(() => {
                alert("Changes successfully saved");
                resetUpdates();
            })
            .catch((e) => alert(e.message));
    }

    return (
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
                        <AppContext.Provider value={{
                            moveUp: moveUp,
                            moveDown: moveDown,
                            updateField: updateField,
                            deleteSection: deleteSection
                        }}>
                            {sections
                                .sort((s1, s2) => s1.seqPosition - s2.seqPosition)
                                .map(s =>
                                    <Section key={s.id} id={s.id} title={s.title} url={s.url} custom={s.custom}
                                             seqPos={s.seqPosition} active={s.active} first={s.seqPosition === 1}
                                             last={s.seqPosition === sections.length}/>
                                )}
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} addButtons={addButtons} onApplyChanges={onApplyChanges}
                                     allLoaded={allLoaded}/>
            </div>
        </div>
    );
};

export default Sections;