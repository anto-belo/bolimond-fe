import {useRef} from 'react';

const FileUploader = ({maxSize, multiple, accept, onUpload}) => {
    const inputFileRef = useRef();

    function onChangeHandler(files) {
        if (!files) return;

        files = [...files];
        let totalFilesSize = 0;
        for (let i = 0; i < files.length; i++) {
            totalFilesSize += files[i].size;
        }
        if (totalFilesSize > maxSize) {
            const sizeInMb = Math.round(totalFilesSize / 1024 / 1024);
            const maxInMb = Math.round(maxSize / 1024 / 1024);
            alert(`Files bundle size ${sizeInMb}MB, but can have ${maxInMb}MB max`);
            return;
        }
        onUpload(files);
        inputFileRef.current.value = '';
    }

    return (<>
        <button className="btn btn-success mb-2" type="button"
                onClick={() => (inputFileRef.current: HTMLInputElement).click()}>
            <i className="fas fa-plus"/>&nbsp;Add image
        </button>
        <input ref={inputFileRef} type="file" style={{display: 'none'}}
               onChange={(e) => onChangeHandler(e.target.files)}
               multiple={multiple} accept={accept}/>
    </>);
};

export default FileUploader;