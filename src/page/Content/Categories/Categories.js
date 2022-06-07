import {useEffect, useState} from 'react';
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import Category from "./Category";
import ResponsiveButtonBar from "../../../component/ResponsiveButtonBar";
import {CategoryService} from "../../../api/CategoryService";
import {checkBlankStringFields, checkUniqueByField} from "../../../util/validationUtils";
import {DEFAULT_PAGE_SIZE} from "../../../api/config";
import {SectionService} from "../../../api/SectionService";

const Categories = () => {
    const [categories, setCategories]
        = useState([]);
    const [allLoaded, onLoadMore]
        = useEntityPageLoader(CategoryService.getByPageOrdered, DEFAULT_PAGE_SIZE, categories, setCategories);
    const [categoryUpdates, addCategory, deleteCategory, updateField, syncChanges]
        = useViewModel(categories, setCategories, (sectionId) => {
            return {
                title: '',
                url: '',
                sectionId: sectionId,
                seqPosition: categories.length + 1,
                active: true
            };
        }
    );

    const [sectionOptions, setSectionOptions] = useState([]);
    useEffect(() => {
        SectionService.getSectionOptions()
            .then((r) => {
                console.log(r.data)
                setSectionOptions(r.data)
            })
            .catch((e) => alert(e.message));
    }, []);

    function onApplyChanges() {
        //todo check for section id
        const newCategories = categories.filter(c => c.id < 0);
        if ((newCategories.length === 0 && categoryUpdates.length === 0)
            || !newCategories.every(c => checkBlankStringFields(c, ['title', 'url'], true))
            || !categoryUpdates.every(c => checkBlankStringFields(c, ['title', 'url'], false))) {
            alert("Nothing to update or some fields are blank");
            return;
        }
        if (!checkUniqueByField(categories, 'title') || !checkUniqueByField(categories, 'url')) {
            alert("Titles and URLs must be unique");
            return;
        }

        const changeSet = {};
        changeSet.newEntities = newCategories.map(c => {
            const newSection = {
                title: c.title,
                url: c.url,
                sectionId: c.sectionId,
                seqPosition: c.seqPosition,
                active: c.active
            };
            if (c.description) {
                newSection.description = c.description;
            }
            return newSection;
        });

        changeSet.entityUpdates = categoryUpdates;
        console.log(changeSet);
        CategoryService.update(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                syncChanges(r.data);
            })
            .catch((e) => alert(e.message));
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
                            sectionOptions: sectionOptions.map(o => ({...o, value: o.title}))
                        }}>
                            {categories.map(c =>
                                <Category key={c.id} id={c.id} title={c.title} url={c.url} sectionId={c.sectionId}
                                          description={c.description} seqPos={c.seqPosition} active={c.active}
                                          last={c.seqPosition === categories.length}/>
                            )}
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} onApplyChanges={onApplyChanges} allLoaded={allLoaded}>
                    <button className="btn btn-info" type="button" onClick={() => addCategory(sectionOptions.length !== 0 && sectionOptions[0].)}>
                        <i className="fas fa-plus"/>&nbsp;Add category
                    </button>
                </ResponsiveButtonBar>
            </div>
        </div>
    );
};

export default Categories;