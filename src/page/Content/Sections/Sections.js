import React, {useMemo, useState} from 'react';
import bcrypt from "bcryptjs";
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import Section from "./Section";
import ResponsiveButtonBar from "../../../component/ResponsiveButtonBar";
import {SectionService} from "../../../api/SectionService";
import {DEFAULT_PAGE_SIZE} from "../../../api/config";

const Sections = () => {
    const [sections, setSections] = useState([]);
    const [allLoaded, onLoadMore]
        = useEntityPageLoader(SectionService.getByPage, DEFAULT_PAGE_SIZE, sections, setSections);
    const [newSections, sectionUpdates, onAddSection, moveUp, moveDown, onDeleteSection, onFieldChange, applyChangeSet]
        = useViewModel(sections, setSections, (custom) => {
            return {
                title: '',
                url: '',
                custom: custom,
                seqPosition: sections.length + newSections.length + 1,
                active: true
            };
        }
    );
    const addButtons = useMemo(() => [
        {
            title: 'Add category section',
            callback: () => onAddSection(false)
        },
        // {
        //     title: 'Add custom section',
        //     callback: () => onAddSection(true)
        // }
    ]);

    function onApplyChanges() {
        if (newSections.filter(u => u.username.trim() !== '' && u.password.trim() !== '').length === 0
            && sectionUpdates.filter(u => u.username ? u.username.trim() !== '' : true).length === 0) {
            alert("Nothing to update or some fields are blank");
            return;
        }
        if (!uniqueUsernames()) {
            alert("Usernames must be unique");
            return;
        }

        const changeSet = {};
        changeSet.newEntities = newSections.map(u => {
            return {
                username: u.username,
                password: bcrypt.hashSync(u.password, 12),
                root: u.root
            };
        });

        changeSet.entityUpdates = sectionUpdates.map(u => {
            return {
                ...u,
                password: bcrypt.hashSync(u.password, 12)
            };
        });
        SectionService.update(changeSet)
            .then(() => {
                alert("Changes successfully saved");
                applyChangeSet();
            })
            .catch((e) => alert(e.message));
    }

    function uniqueUsernames() {
        const usernames = [...sections, ...newSections]
            .map(u => u.username)
            .filter(name => name);
        return usernames.length === new Set(usernames).size;
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
                            setField: onFieldChange,
                            onDelete: onDeleteSection
                        }}>
                            {[...sections, ...newSections]
                                .sort((s1, s2) => s1.seqPosition - s2.seqPosition)
                                .map(s =>
                                    <Section key={s.id} id={s.id} title={s.title} url={s.url} custom={s.custom}
                                             seqPos={s.seqPosition} active={s.active} first={s.seqPosition === 1}
                                             last={s.seqPosition === sections.length + newSections.length}/>
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