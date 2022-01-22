import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import IconButton from '@mui/material/IconButton';
import UploadFileIcon from '@mui/icons-material/UploadFileRounded';

function MyDropzone(props) {
  const onDrop = useCallback(fileObjects => {
    if(fileObjects.length === 0 )
    {
      return;
    }
    const reader = new FileReader()
    reader.onload = loadEvent => {
      if( props.onImport )
      {
        props.onImport(
          { file: fileObjects[0], content : loadEvent.target.result}
        );
      }
    }
    reader.readAsArrayBuffer(fileObjects[0]);
  }, [props]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})

  return (
    <div {...getRootProps()} style={{width: "inherit", height: "inherit"}}>
      <input {...getInputProps()} />
      {

          <IconButton
            color={isDragActive ? "success" : "primary"}
            aria-label="upload file"
            variant={isDragActive ? "contained" : "outlined"}
            style={{width: "inherit", height: "inherit"}}
          >
            <UploadFileIcon className="Icon3x" />
          </IconButton>
      }
    </div>
  )
}

export default MyDropzone;