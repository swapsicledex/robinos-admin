"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ImagePreview } from '@/components/imagePreview';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null)
  const [fileNameWithExtension, setFileNameWithExtension] = useState<string | null>(null)

  const setFileHandler = async (newFile: File) => {
    setFile(newFile)
    const randomFileName = uuidv4()
    const extension = newFile.name.split('.').pop()
    const fullName = `${randomFileName}.${extension}`
    setFileNameWithExtension(fullName)
    try {
      const response = await axios.get(`/api/getuploadurl?name=${fullName}`);
      const url = response.data.url
      setPreSignedUrl(url)
    } catch (error) {
      console.error('Error Getting pre signed url:', error);
    }
  }

  const handleUpload = async () => {
    if(file && preSignedUrl){
      try {
        const response = await axios.put(preSignedUrl, file, {
          headers: {
            "Content-Type": file.type,
          }
        });
        console.log('File uploaded successfully:', response);
        const imageUrl = await axios.get(`/api/saveimageurl?name=${fileNameWithExtension}`);
        console.log(imageUrl.data.url)
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  return (
    <>
      <input type="file" onChange={e => e.target.files ? setFileHandler(e.target.files[0]) : null} />
      {file && <ImagePreview file={file}/>}
      <Button onClick={handleUpload}>Upload</Button>
    </>
  );
}

export default Home;