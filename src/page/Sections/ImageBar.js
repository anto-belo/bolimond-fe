import {useEffect, useRef, useState} from 'react';
import {MAX_FILE_BUNDLE_SIZE} from "../../api/config";
import {useEntityPageLoader} from "../../hook/useEntityPageLoader";
import FileUploader from "../../component/FileUploader";
import {FileService} from "../../api/FileService";
import ImageItem from "./ImageItem";

const ImageBar = ({putImgTag}) => {
    const [images, setImages] = useState([]);
    const [allLoaded, onLoadMore] = useEntityPageLoader(FileService.getCustomPagesImagesByPage, 30,
        images, setImages);

    const observerRef = useRef(null);
    const observedRef = useRef(null);
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !allLoaded) {
                onLoadMore();
            }
        });
        observerRef.current.observe(observedRef.current);
    }, [images]);

    function onFilesUpload(files) {
        FileService.uploadCustomPageImages(files)
            .then((r) => {
                // The response from server is list of names, with which files were saved + error string
                if (r.data.length !== files.length + 1) {
                    alert(`Files were uploaded partially. Reasons:\n${r.data.pop()}`);
                } else {
                    r.data.pop();
                    setImages([...r.data, ...images]);
                }
            })
            .catch(e => alert(e.message));
    }

    function deleteImage(name) {
        FileService.deleteCustomPagesImage(name)
            .then(() => setImages([...images.filter(i => i !== name)]))
            .catch(e => alert(e.response.data));
    }

    return (<>
        <FileUploader maxSize={MAX_FILE_BUNDLE_SIZE} multiple={true} accept='image/*' onUpload={onFilesUpload}/>
        <div className='overflow-auto'>
            <ul className="list-group">
                {images.length === 0
                    ? <li className="list-group-item text-center" style={{fontStyle: 'italic'}}>
                        Folder is empty. Add some images by clicking the button above.
                    </li>
                    : images.map((name, index) =>
                        <ImageItem key={index} name={name} deleteImage={deleteImage} putImgTag={putImgTag}/>
                    )}
                <li ref={observedRef}/>
            </ul>
        </div>
    </>);
};

export default ImageBar;