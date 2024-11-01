"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import axios from 'axios';

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    }

    reader.readAsDataURL(file);
  }, [file]);

  const setFileHandler = async (file: File) => {
    setFile(file)
    try {
      const response = await axios.get("/api/getuploadurl");
      const url = response.data.url
      setPreSignedUrl(url)
    } catch (error) {
      console.error('Error Getting pre signed url:', error);
    }
  }

  const handleUpload = async () => {
    const formData = new FormData();
    if(file && preSignedUrl){
      formData.append('file', file);
      try {
        const response = await axios.put(preSignedUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('File uploaded successfully:', response);
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