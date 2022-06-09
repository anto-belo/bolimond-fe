import {useContext, useRef, useState} from 'react';
import {AppContext} from "../../context/AppContext";
import FileUploader from "../FileUploader";
import {MAX_IMAGE_BLOCK_SIZE} from "../../api/config";

const ImageField = ({name, value, fullPhoto}) => {
    const appContext = useContext(AppContext);

    const [fileUrl, setFileUrl] = useState(null);

    const imgBlockRef = useRef(null);

    function onUploadHandler(file) {
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
        }
        const url = URL.createObjectURL(file);
        appContext.updateField(appContext.entityId, name, {
            file: file,
            url: url
        });
        setFileUrl(url);
    }

    function onMouseEnterHandler() {
        if (fullPhoto) return;
        (imgBlockRef.current: HTMLDivElement).classList.toggle("overflow-hidden", false);
        imgBlockRef.current.style.zIndex = 2000;
    }

    function onMouseLeaveHandler() {
        if (fullPhoto) return;
        (imgBlockRef.current: HTMLDivElement).classList.toggle("overflow-hidden", true);
        imgBlockRef.current.style.zIndex = 'auto';
    }

    const imgStyle = {maxWidth: '100%'};
    if (fullPhoto) {
        imgStyle.maxHeight = '100%';
    }

    return (
        <td>
            <div className="d-flex">
                {value.url
                    ? <>
                        <FileUploader accept='image/*' multiple={false} maxSize={MAX_IMAGE_BLOCK_SIZE}
                                      btnStyle='btn-sm btn-primary' btnText='Change' resetAfter={false}
                                      onUpload={(files) => onUploadHandler(files[0])}/>
                        <div ref={imgBlockRef} className="ms-2 flex-grow-1 overflow-hidden rounded"
                             onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}
                             style={{height: '38px'}}>
                            {value.url && <img src={value.url} alt='Image preview' className='rounded'
                                               style={imgStyle}/>}
                        </div>
                    </>
                    : <FileUploader accept='image/*' multiple={false} maxSize={MAX_IMAGE_BLOCK_SIZE}
                                    btnStyle='btn-sm btn-outline-success flex-grow-1' btnText='Choose file'
                                    resetAfter={false}
                                    onUpload={(files) => onUploadHandler(files[0])}/>
                }
            </div>
        </td>
    );
};

export default ImageField;