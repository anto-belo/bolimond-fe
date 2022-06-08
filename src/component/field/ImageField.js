import {useContext, useState} from 'react';
import {AppContext} from "../../context/AppContext";
import FileUploader from "../FileUploader";
import {MAX_IMAGE_BLOCK_SIZE} from "../../api/config";

const ImageField = ({name, value}) => {
    const appContext = useContext(AppContext);
    console.log(value)

    const [fileUrl, setFileUrl] = useState(null);

    function onUploadHandler(file) {
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
        }
        const url = URL.createObjectURL(file);
        appContext.updateField(appContext.entityId, name, {
            file: file,
            url: fileUrl
        });
        setFileUrl(url);
    }

    return (
        <td>
            <div className="d-flex">
                {value.url
                    ? <>
                        <FileUploader accept='image/*' multiple={false} maxSize={MAX_IMAGE_BLOCK_SIZE}
                                      btnStyle='btn-primary' btnText='Change' resetAfter={false}
                                      onUpload={(files) => onUploadHandler(files[0])}/>
                        <div className="h-100 flex-grow-1 overflow-hidden">
                            {fileUrl && <img src={value.url} alt='Image preview'/>}
                        </div>
                    </>
                    : <FileUploader accept='image/*' multiple={false} maxSize={MAX_IMAGE_BLOCK_SIZE}
                                    btnStyle='btn-outline-success' btnText='Choose file' resetAfter={false}
                                    onUpload={(files) => onUploadHandler(files[0])}/>
                }
            </div>
        </td>
    );
};

export default ImageField;