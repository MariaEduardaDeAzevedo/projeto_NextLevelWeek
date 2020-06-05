import React, {useCallback, useState} from 'react'
import { FiUpload, FiChevronsDown } from 'react-icons/fi'
import Dropzone, {useDropzone, DropEvent} from 'react-dropzone'
import './style.css'

interface Props {
  onFileUploaded: (file: File) => void;
}

const DropZone:React.FC<Props> = ( { onFileUploaded } ) => {

  const [image, setImage] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setImage(fileUrl);
    onFileUploaded(file);
    
  }, [onFileUploaded])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/*'
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {
        
        image 
        ? <img src={image} alt="uploaded image"></img>
            :   isDragActive ?
                <p>
                    <FiChevronsDown />

                    Solte a imagem...
                </p> :
                <p>
                    <FiUpload />

                    Clique para adicionar ou arraste uma imagem aqui
                </p>
      }
    </div>
  )
}

export default DropZone;
