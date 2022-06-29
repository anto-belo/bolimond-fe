import {useRef, useState} from 'react';
import {API_URL, Folder} from "../../api/config";

const ImageItem = ({name, deleteImage, putImgTag}) => {
    const [showDeleteAccept, setShowDeleteAccept] = useState(false);

    const imgFieldRef = useRef(null);
    const imgRef = useRef(null);

    function onMouseEnterHandler() {
        imgRef.current = document.createElement('img');
        imgRef.current.src = `${API_URL}/img/${Folder.CUSTOM_PAGE_IMG}/${name}`;
        imgRef.current.classList.add('rounded');
        imgRef.current.style.position = 'fixed';
        imgRef.current.style.margin = '-.5rem -1rem';
        imgRef.current.style.width = imgFieldRef.current.offsetWidth + 'px';
        imgRef.current.style.zIndex = 2;
        imgFieldRef.current?.insertBefore(imgRef.current, imgFieldRef.current?.firstChild);
    }

    function onMouseLeaveHandler() {
        setShowDeleteAccept(false);
        imgRef.current?.remove();
    }

    return (
        <li ref={imgFieldRef} className="list-group-item" onMouseLeave={onMouseLeaveHandler}
        >
            {showDeleteAccept
                ? <div className="d-flex flex-row align-items-center">
                    <span className="text-danger fst-italic">Are you sure?</span>
                    <button type="button" className="ms-2 my-0 me-0 text-danger as-link" onClick={() => {
                        deleteImage(name);
                        setShowDeleteAccept(false);
                    }}>
                        Yes, delete
                    </button>
                </div>
                : <div className="d-flex flex-row align-items-center justify-content-between">
                    <div className='cursor-pointer text-truncate w-100' title={name}>
                        {name}
                    </div>
                    <div style={{minWidth: '80px'}}>
                        <i className="fas fa-eye me-1 action-icon put-img-tag-icon" onMouseEnter={onMouseEnterHandler}/>
                        <a href={`${API_URL}/admin/fs/${Folder.CUSTOM_PAGE_IMG}/${name}`} title={`Download ${name}`}>
                            <i className="fas fa-download me-1 action-icon download-icon"/>
                        </a>
                        <i className="fas fa-code me-1 action-icon put-img-tag-icon" title={`Put img tag with ${name}`}
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