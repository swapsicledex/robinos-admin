import { useState } from "react";
import Image from 'next/image'
import { Card } from "./ui/card";

export const ImagePreview = (
  ({ file}:{file: File}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      if(typeof reader.result === 'string') setPreviewUrl(reader.result);
      else console.error('Unexpected file type:', typeof reader.result);
    }
    reader.readAsDataURL(file);
    return (
      <>
      {previewUrl && 
        <Card>
          <Image src={previewUrl} alt="Preview" width={200} height={200}/>
        </Card>}
      </>
    )
  }
)