import {useState} from 'react';
import {API_URL, Folder} from "../../api/config";

const ImageItem = ({name, deleteImage, putImgTag}) => {
    const [showDeleteAccept, setShowDeleteAccept] = useState(false);

    return (
        <li className="list-group-item" onMouseLeave={() => setShowDeleteAccept(false)}>
            {showDeleteAccept
                ? <div className="d-flex flex-row align-items-center">
                    <span className="text-danger fst-italic">Are you sure?</span>
                    <button type="button" onClick={() => deleteImage(name)}
                            className="ms-2 my-0 me-0 text-danger as-link">
                        Yes, delete
                    </button>
                </div>
                : <div className="d-flex flex-row align-items-center justify-content-between">
                    <div className='cursor-pointer text-truncate w-100' title={name}>
                        {name}
                    </div>
                    <div style={{minWidth: '58px'}}>
                        <a href={`${API_URL}/admin/fs/${Folder.CUSTOM_PAGE_IMG}/${name}`} title={`Download ${name}`}>
                            <i className="fas fa-download action-icon download-icon"/>
                        </a>
                        <i className="fas fa-code mx-1 action-icon put-img-tag-icon" title={`Put img tag with ${name}`}
                           onClick={() => putImgTag(name)}/>
                        <i className="fas fa-trash-alt action-icon delete-icon" title={`Delete ${name}`}
                           onClick={() => setShowDeleteAccept(true)}/>
                    </div>
                </div>
            }
        </li>
    );
};

export default ImageItem;