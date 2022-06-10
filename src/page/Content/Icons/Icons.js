import {useState} from 'react';
import {useEntityPageLoader} from "../../../hook/useEntityPageLoader";
import {useViewModel} from "../../../hook/useViewModel";
import {AppContext} from "../../../context/AppContext";
import Icon from "./Icon";
import ResponsiveButtonBarOld from "../../../component/ResponsiveButtonBarOld";
import {IconService} from "../../../api/IconService";
import {API_URL, DEFAULT_PAGE_SIZE, Folder} from "../../../api/config";
import {checkBlankStringFields} from "../../../util/validationUtils";

const dbEntityMapper = dbEntity => {
    const entity = {
        ...dbEntity,
        pic: {url: `${API_URL}/img/${Folder.ICONS}/${dbEntity.picUrl}`}
    };
    delete entity.picUrl;
    return entity;
};

const Icons = () => {
    const [icons, setIcons]
        = useState([]);
    const [iconUpdates, addIcon, deleteIcon, updateField, syncChanges, updateInitialPositions]
        = useViewModel(icons, setIcons, () => ({
        title: '',
        pic: {url: ''},
        linkToUrl: '',
        seqPosition: icons.length + 1,
        active: true
    }));
    const [allLoaded, onLoadMore]
        = useEntityPageLoader(IconService.getByPageOrdered, DEFAULT_PAGE_SIZE, icons, setIcons,
        updateInitialPositions, dbEntityMapper);

    function onApplyChanges() {
        const newIcons = icons.filter(i => i.id < 0);
        if ((newIcons.length === 0 && iconUpdates.length === 0)
            || !newIcons.every(i => checkBlankStringFields(i, ['title', 'linkToUrl'], true))
            || !iconUpdates.every(i => checkBlankStringFields(i, ['title', 'linkToUrl'], false))
            || ![...iconUpdates.filter(i => i.hasOwnProperty('pic')), ...newIcons]
                .every(i => i.hasOwnProperty('pic') && i.pic.hasOwnProperty('file'))) {
            alert("Nothing to update or some fields are blank");
            return;
        }

        const changeSet = new FormData();
        let j = 0;
        newIcons.forEach(i => {
            changeSet.append(`newEntities[${j}].title`, i.title);
            changeSet.append(`newEntities[${j}].pic`, i.pic.file);
            changeSet.append(`newEntities[${j}].linkToUrl`, i.linkToUrl);
            changeSet.append(`newEntities[${j}].seqPosition`, i.seqPosition);
            changeSet.append(`newEntities[${j}].active`, i.active);
            j++;
        });

        j = 0;
        iconUpdates.forEach(u => {
            changeSet.append(`entityUpdates[${j}].id`, u.id);
            if (u.hasOwnProperty('delete')) {
                changeSet.append(`entityUpdates[${j}].delete`, true);
                return;
            }
            if (u.hasOwnProperty('title')) changeSet.append(`entityUpdates[${j}].title`, u.title);
            if (u.hasOwnProperty('pic')) changeSet.append(`entityUpdates[${j}].pic`, u.pic.file);
            if (u.hasOwnProperty('linkToUrl')) changeSet.append(`entityUpdates[${j}].linkToUrl`, u.linkToUrl);
            if (u.hasOwnProperty('seqPosition'))
                changeSet.append(`entityUpdates[${j}].seqPosition`, u.seqPosition);
            if (u.hasOwnProperty('active')) changeSet.append(`entityUpdates[${j}].active`, u.active);
            j++;
        });
        IconService.update(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                syncChanges(r.data.map(e => dbEntityMapper(e)));
            })
            .catch((e) => alert(e.message));
    }

    return (
        <div className="row">
            <div className="col">
                <h1>Icons</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th className='image-column'>Image</th>
                            <th>URL</th>
                            <th className='order-column'>Order</th>
                            <th>Active</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        <AppContext.Provider value={{
                            deleteEntity: deleteIcon,
                            updateField: updateField
                        }}>
                            {icons
                                .sort((i1, i2) => i1.seqPosition - i2.seqPosition)
                                .map(i =>
                                    <Icon key={i.id} id={i.id} title={i.title} pic={i.pic} linkToUrl={i.linkToUrl}
                                          seqPos={i.seqPosition} active={i.active}
                                          last={i.seqPosition === icons.length}/>
                                )
                            }
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBarOld onApplyChanges={onApplyChanges} onLoadMore={onLoadMore} allLoaded={allLoaded}>
                    <button className="btn btn-info text-white" type="button" onClick={addIcon}>
                        <i className="fas fa-image"/>&nbsp;Add icon
                    </button>
                </ResponsiveButtonBarOld>
            </div>
        </div>
    );
};

export default Icons;