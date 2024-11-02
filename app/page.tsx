"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null)
  const [fileNameWithExtension, setFileNameWithExtension] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if(typeof reader.result === 'string') setPreviewUrl(reader.result);
      else console.error('Unexpected file type:', typeof reader.result);
    }
    reader.readAsDataURL(file);
  }, [file]);

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
      {previewUrl && <Image src={previewUrl} alt="Preview" width={200} height={200}/>}
      <Button onClick={handleUpload}>Upload</Button>
    </>
  );
}

export default Home;