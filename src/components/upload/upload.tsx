"use client";

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useState } from 'react';

const Upload = () => {
    const [resource, setResource] = useState<string | CloudinaryUploadWidgetInfo>();
  return ( 
    <CldUploadWidget
        uploadPreset="<Your Upload Preset>"
        onSuccess={(result, { widget }) => {
            setResource(result?.info);  // { public_id, secure_url, etc }
        }}
        onQueuesEnd={(result, { widget }) => {
            widget.close();
        }}
    >
        {({ open }) => {
            function handleOnClick() {
                setResource(undefined);
                open();
            }
            return (
                <button onClick={handleOnClick}>
                    Upload an Image
                </button>
            );
        }}
    </CldUploadWidget>
  )
}

export default Upload