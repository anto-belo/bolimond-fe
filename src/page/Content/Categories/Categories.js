import {useEffect, useState} from 'react';
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import Category from "./Category";
import ResponsiveButtonBarOld from "../../../component/ResponsiveButtonBarOld";
import {CategoryService} from "../../../api/CategoryService";
import {SectionService} from "../../../api/SectionService";
import {checkBlankStringFields} from "../../../util/validationUtils";
import {DEFAULT_PAGE_SIZE} from "../../../api/config";

const Categories = () => {
    const [categories, setCategories]
        = useState([]);
    const [categoryUpdates, addCategory, deleteCategory, updateField, syncChanges, updateInitialPositions]
        = useViewModel(categories, setCategories, () => {
            return {
                title: '',
                url: '',
                description: '',
                sectionId: 0,
                seqPosition: categories.length + 1,
                active: true
            };
        }
    );
    const [allLoaded, onLoadMore]
        = useEntityPageLoader(CategoryService.getByPageOrdered, DEFAULT_PAGE_SIZE, categories, setCategories,
        updateInitialPositions);

    const [sectionOptions, setSectionOptions] = useState([]);
    useEffect(() => {
        SectionService.getSectionOptions()
            .then((r) => setSectionOptions(r.data.map(s => ({...s, value: s.title}))))
            .catch((e) => alert(e.message));
    }, []);

    function onApplyChanges() {
        if (categories.some(c => c.sectionId === 0)) {
            alert("All categories must be assigned to sections");
            return;
        }

        const newCategories = categories.filter(c => c.id < 0);
        if ((newCategories.length === 0 && categoryUpdates.length === 0)
            || !newCategories.every(c => checkBlankStringFields(c, ['title', 'url'], true))
            || !categoryUpdates.every(c => checkBlankStringFields(c, ['title', 'url'], false))) {
            alert("Nothing to update or some fields are blank");
            return;
        }

        const changeSet = {};
        changeSet.newEntities = newCategories.map(c => ({
            title: c.title,
            url: c.url,
            description: c.description,
            sectionId: c.sectionId,
            seqPosition: c.seqPosition,
            active: c.active
        }));

        changeSet.entityUpdates = categoryUpdates;
        CategoryService.update(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                syncChanges(r.data);
            })
            .catch((e) => alert(e.response.data));
    }

    /**
     * This is pre-check for an attempt to assign to a category section
     * which already has category with this name or url. Note, validity
     * is checked over the set, consisting of elements that have been
     * already loaded from database + newly created. Full check is
     * performed on a database level, this function checks user input only.
     * @param sectionId section id, to which reassign is performing
     * @param categoryId category id, for which reassign is performing
     * @returns true if section can be reassigned, false elsewhere
     */
    function categorySectionInconsistency(sectionId, categoryId) {
        const curCategory = categories.find(c => c.id === categoryId);
        const sectionCategories = categories.filter(c => c.sectionId === sectionId && c.id !== categoryId);
        return (sectionCategories.some(c => c.title === curCategory.title) && 'title')
            || ((sectionCategories.some(c => c.url === curCategory.url)) && 'url')
            || null;
    }

    return (
        <div className="row">
            <div className="col">
                <h1>Categories</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className='w-25'>Title</th>
                            <th className='w-25'>URL</th>
                            <th className='text-center'>Section</th>
                            <th>Description</th>
                            <th className='text-center' style={{minWidth: '120px'}}>Order</th>
                            <th className='text-center'>Active</th>
                            <th className='text-center'>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        <AppContext.Provider value={{
                            updateField: updateField,
                            deleteCategory: deleteCategory,
                            sectionOptions: sectionOptions,
                            categorySectionInconsistency: categorySectionInconsistency
                        }}>
                            {categories
                                .sort((c1, c2) => c1.seqPosition - c2.seqPosition)
                                .map(c =>
                                    <Category key={c.id} id={c.id} title={c.title} url={c.url} sectionId={c.sectionId}
                                              description={c.description || ''} seqPos={c.seqPosition} active={c.active}
                                              last={c.seqPosition === categories.length}/>
                                )}
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBarOld onLoadMore={onLoadMore} onApplyChanges={onApplyChanges} allLoaded={allLoaded}>
                    <button className="btn btn-info" type="button" onClick={addCategory}>
                        <i className="fas fa-plus"/>
                        &nbsp;Add category
                    </button>
                </ResponsiveButtonBarOld>
            </div>
        </div>
    );
};

export default Categories;