import {useState} from 'react';
import {useEntityPageLoader} from "../../hook/useEntityPageLoader";
import {useViewModel} from "../../hook/useViewModel";
import {AppContext} from "../../context/AppContext";
import Icon from "./Icon";
import {IconService} from "../../api/IconService";
import {checkBlankStringFields} from "../../util/validationUtils";
import {API_URL, DEFAULT_PAGE_SIZE, Folder} from "../../api/config";
import ResponsiveButtonBar from "../../component/ResponsiveButtonBar";
import ProcessingButtonSpinner from "../../component/ProcessingButtonSpinner";

const dbEntityMapper = dbEntity => {
    const entity = {
        ...dbEntity,
        pic: {url: `${API_URL}/img/${Folder.ICONS}/${dbEntity["picUrl"]}`}
    };
    delete entity["picUrl"];
    return entity;
};

const Icons = () => {
    const [icons, setIcons] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [iconUpdates, addIcon, deleteIcon, updateField, syncChanges, updateInitialPositions]
        = useViewModel(icons, setIcons, () => ({
        title: '',
        pic: {url: ''},
        linkToUrl: '',
        seqPosition: icons.length + 1,
        active: true
    }));
    const [allLoaded, onLoadMore] = useEntityPageLoader(IconService.getByPageOrdered, DEFAULT_PAGE_SIZE,
        icons, setIcons, updateInitialPositions, dbEntityMapper);

    function onApplyChanges() {
        setProcessing(true);
        const newIcons = icons.filter(i => i.id < 0);
        if ((newIcons.length === 0 && iconUpdates.length === 0)
            || !newIcons.every(i => checkBlankStringFields(i, ['title', 'linkToUrl'], true))
            || !iconUpdates.every(i => checkBlankStringFields(i, ['title', 'linkToUrl'], false))
            || ![...iconUpdates.filter(i => i.hasOwnProperty('pic')), ...newIcons]
                .every(i => i.hasOwnProperty('pic') && i.pic.hasOwnProperty('file'))) {
            alert("Nothing to update or some fields are blank");
            setProcessing(false);
            return;
        }

        const changeSet = new FormData();
        newIcons.forEach((ico, i) => {
            changeSet.append(`newEntities[${i}].title`, ico.title);
            changeSet.append(`newEntities[${i}].pic`, ico.pic.file);
            changeSet.append(`newEntities[${i}].linkToUrl`, ico.linkToUrl);
            changeSet.append(`newEntities[${i}].seqPosition`, ico.seqPosition);
            changeSet.append(`newEntities[${i}].active`, ico.active);
        });

        iconUpdates.forEach((u, i) => {
            changeSet.append(`entityUpdates[${i}].id`, u.id);
            if (u.hasOwnProperty('delete')) {
                changeSet.append(`entityUpdates[${i}].delete`, true);
                setProcessing(false);
                return;
            }

            if (u.hasOwnProperty('title'))
                changeSet.append(`entityUpdates[${i}].title`, u.title);
            if (u.hasOwnProperty('pic'))
                changeSet.append(`entityUpdates[${i}].pic`, u.pic.file);
            if (u.hasOwnProperty('linkToUrl'))
                changeSet.append(`entityUpdates[${i}].linkToUrl`, u.linkToUrl);
            if (u.hasOwnProperty('seqPosition'))
                changeSet.append(`entityUpdates[${i}].seqPosition`, u.seqPosition);
            if (u.hasOwnProperty('active'))
                changeSet.append(`entityUpdates[${i}].active`, u.active);
        });

        IconService.update(changeSet)
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
                <h1>Icons</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th className='w-10'>Image</th>
                            <th>URL</th>
                            <th className='order-column'>Order</th>
                            <th>Active</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        <AppContext.Provider value={{
                            deleteEntity: deleteIcon,
                            updateField: updateField,
                            firstOrdered: 1,
                            lastOrdered: icons.length
                        }}>
                            {icons
                                .sort((i1, i2) => i1.seqPosition - i2.seqPosition)
                                .map(i =>
                                    <Icon key={i.id} id={i.id} title={i.title} pic={i.pic} linkToUrl={i.linkToUrl}
                                          seqPos={i.seqPosition} active={i.active}/>
                                )
                            }
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} allLoaded={allLoaded}>
                    <button className="btn btn-info text-white" type="button" onClick={addIcon}>
                        <i className="fas fa-image"/>&nbsp;Add icon
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

export default Icons;