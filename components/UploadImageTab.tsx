import React, { useEffect } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";
import LightPreview from "@/components/ui/LightPreview";
import DarkPreview from "@/components/ui/DarkPreview";

export default function UploadImageTab({
  editMode,
  editId,
  editName,
  editUrl,
  uploadHandler,
}: {
  editMode: boolean;
  editId: number;
  editName: string;
  editUrl: string;
  uploadHandler: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null);
  const [fileNameWithExtension, setFileNameWithExtension] = useState<
    string | null
  >(null);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editMode) {
      setIsLoading(true);
      try {
        setPreviewURL(editUrl);
        setFileName(editName);
        uploadFileFromUrl(editUrl, editName);
      } catch {}
      setIsLoading(false);
    }
  }, []);

  const setFileHandler = async (newFile: File) => {
    setFile(newFile);
    const randomFileName = uuidv4();
    const extension = newFile.name.split(".").pop();
    const fullName = `${randomFileName}.${extension}`;
    setFileNameWithExtension(fullName);
    try {
      const response = await axios.get(`/api/getuploadurl?name=${fullName}`);
      setPreSignedUrl(response.data.url);
    } catch (error) {
      console.error("Error Getting pre-signed URL:", error);
      toast.error("Failed to get upload URL.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEdited(true);
    const file = e.target.files?.[0];
    // console.log("file: ", file);
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
      setFileHandler(file);
    } else {
      setPreviewURL(null);
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (file && preSignedUrl) {
      setIsLoading(true);
      try {
        await axios.put(preSignedUrl, file, {
          headers: { "Content-Type": file.type },
        });
        if (editMode) {
          await axios.put("/api/updateimage", {
            id: editId,
            name: fileName,
            imageName: fileNameWithExtension,
          });
          toast.success(`Details updated successfully!`);
          uploadHandler();
        } else {
          await axios.post("/api/saveimageurl", {
            name: fileName,
            imageName: fileNameWithExtension,
          });
          toast.success(`File uploaded successfully!`);
        }

        setPreviewURL(null);
        setFile(null);
        setFileName("");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file.");
      }
      setIsLoading(false);
    }
  };

  async function uploadFileFromUrl(url: string, name: string) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch file from URL: ${response.statusText}`
        );
      }

      const format = url.split(".").at(-1);
      const blob = await response.blob();
      const file = new File([blob], `${name}.${format}`, { type: blob.type });
      setFileHandler(file);
    } catch (error) {
      console.error("Error uploading file from URL:", error);
    }
  }

  return (
    <div className="flex flex-col gap-4 bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-blue-600 border-4 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      {!editMode ? (
        <h2 className="text-2xl font-semibold mb-4">Upload and Preview</h2>
      ) : null}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border border-gray-300 rounded-lg p-1 w-64"
        required
      />

      <label className="text-gray-600">Team/Player Name</label>
      <input
        type="text"
        placeholder="Enter team/player name"
        value={fileName}
        onChange={(e) => {
          setIsEdited(true);
          setFileName(e.target.value);
        }}
        className="border border-gray-300 rounded-lg p-2 w-48"
        required
      />

      {previewURL && (
        <div className="flex space-x-4 mt-6 justify-center">
          <LightPreview previewURL={previewURL} />
          <DarkPreview previewURL={previewURL} />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={(editMode && !isEdited) || !file || !fileName}
        className={`mt-4 py-2 px-4 rounded-lg w-full ${
          (editMode && !isEdited) || !file || !fileName
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-500"
        }`}
      >
        Upload
      </button>
    </div>
  );
}
