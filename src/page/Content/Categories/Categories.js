import {useEffect, useState} from 'react';
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import Category from "./Category";
import {CategoryService} from "../../../api/CategoryService";
import {SectionService} from "../../../api/SectionService";
import {checkBlankStringFields} from "../../../util/validationUtils";
import {DEFAULT_PAGE_SIZE} from "../../../api/config";
import ResponsiveButtonBar from "../../../component/ResponsiveButtonBar";
import ProcessingButtonSpinner from "../../../component/ProcessingButtonSpinner";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [categoryUpdates, addCategory, deleteCategory, updateField, syncChanges, updateInitialPositions]
        = useViewModel(categories, setCategories, () => {
        return {
            title: '',
            url: '',
            description: '',
            sectionId: 0,
            seqPosition: categories.length + 1,
            active: true,
            removable: true
        };
    });
    const [allLoaded, onLoadMore] = useEntityPageLoader(CategoryService.getByPageOrdered, DEFAULT_PAGE_SIZE,
        categories, setCategories, updateInitialPositions);

    const [sectionOptions, setSectionOptions] = useState([]);
    useEffect(() => {
        SectionService.getSectionOptions()
            .then((r) => setSectionOptions(r.data))
            .catch((e) => alert(e.message));
    }, []);

    function onApplyChanges() {
        setProcessing(true);
        if (categories.some(c => c.sectionId === 0)) {
            alert("All categories must be assigned to sections");
            setProcessing(false);
            return;
        }

        const newCategories = categories.filter(c => c.id < 0);
        if ((newCategories.length === 0 && categoryUpdates.length === 0)
            || !newCategories.every(c => checkBlankStringFields(c, ['title', 'url'], true))
            || !categoryUpdates.every(c => checkBlankStringFields(c, ['title', 'url'], false))) {
            alert("Nothing to update or some fields are blank");
            setProcessing(false);
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
                setProcessing(false);
                syncChanges(r.data);
            })
            .catch((e) => {
                alert(e.response.data);
                setProcessing(false);
            });
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
                            <th>Title</th>
                            <th>URL</th>
                            <th>Section</th>
                            <th>Description</th>
                            <th style={{minWidth: '120px'}}>Order</th>
                            <th>Active</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        <AppContext.Provider value={{
                            deleteEntity: deleteCategory,
                            updateField: updateField,
                            sectionOptions: sectionOptions,
                            categorySectionInconsistency: categorySectionInconsistency,
                            firstOrdered: 1,
                            lastOrdered: categories.length
                        }}>
                            {categories
                                .sort((c1, c2) => c1.seqPosition - c2.seqPosition)
                                .map(c =>
                                    <Category key={c.id} id={c.id} title={c.title} url={c.url} sectionId={c.sectionId}
                                              description={c.description || ''} seqPos={c.seqPosition} active={c.active}
                                              removable={c.removable}/>
                                )}
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} allLoaded={allLoaded}>
                    <button className="btn btn-info text-white" type="button" onClick={addCategory}>
                        <i className="fas fa-plus"/>&nbsp;Add category
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

export default Categories;