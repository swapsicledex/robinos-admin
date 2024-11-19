import React, { useEffect } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";
import LightPreview from "@/components/ui/LightPreview";
import DarkPreview from "@/components/ui/DarkPreview";
import Dropdown from "./ui/Dropdown";
import { Category, Player } from "@/db/schema";

export default function UploadImageTab({
  editMode,
  editItem,
  uploadHandler,
}: {
  editMode: boolean;
  editItem: Player | null;
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

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [symbol, setSymbol] = useState("");

  const getAllCategoriesData = async () => {
    setIsLoading(true);
    const response = await axios.get("/api/getallcategories");
    setIsLoading(false);
    setAllCategories(response.data);
  };

  useEffect(() => {
    getAllCategoriesData();
    if (editMode&&editItem) {
      setIsLoading(true);
      try {
        setPreviewURL(editItem.url);
        setFileName(editItem.name);
        uploadFileFromUrl(editItem.url, editItem.name);
        setSymbol(editItem.symbol);
        setSelectedCategory(editItem.category);
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file && preSignedUrl) {
      setIsLoading(true);
      try {
        await axios.put(preSignedUrl, file, {
          headers: { "Content-Type": file.type },
        });
        if (editMode) {
          await axios.put("/api/updateimage", {
            id: editItem?.id,
            name: fileName,
            imageName: fileNameWithExtension,
          });
          toast.success(`Details updated successfully!`);
          uploadHandler();
        } else {
          console.log("selectedCategory: ", selectedCategory);
          await axios.post("/api/saveimageurl", {
            name: fileName,
            imageName: fileNameWithExtension,
            symbol: symbol,
            category: selectedCategory,
          });
          toast.success(`File uploaded successfully!`);
        }

        setPreviewURL(null);
        setFile(null);
        setFileName("");
        setSelectedCategory(null);
        setSymbol("");
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
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto"
      >
        {!editMode ? (
          <h2 className="text-2xl font-semibold mb-4">Upload and Preview</h2>
        ) : null}

        {/* Name Input */}
        <label className="block mb-2 font-medium">
          Player Name
          <input
            type="text"
            value={fileName}
            onChange={(e) => {
              setIsEdited(true);
              setFileName(e.target.value);
            }}
            className="border border-gray-300 rounded-lg p-2 w-full mt-1"
            placeholder="Enter player name"
            required
          />
        </label>

        {/* Symbol Input */}
        <label className="block mb-2 font-medium">
          Symbol
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full mt-1"
            placeholder="Enter player symbol"
            required
          />
        </label>
        {/* Category Dropdown */}
        <label className="block mb-2 font-medium">
          Category
          <Dropdown
            items={allCategories.map((category) => ({
              id: category.id,
              name: category.category,
            }))}
            placeholder="Choose a category"
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            onChange={(value: any) => {
              setSelectedCategory(value.id);
            }}
          />
        </label>
        {/* File Upload */}
        <label className="block mb-2 font-medium">
          Upload File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-1 w-64"
            required
          />
          {file && (
            <div className="mt-2 text-sm text-gray-600">
              Selected File: {file.name}
            </div>
          )}
          {previewURL && (
            <div className="flex space-x-4 mt-6 justify-center">
              <LightPreview previewURL={previewURL} />
              <DarkPreview previewURL={previewURL} />
            </div>
          )}
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={(editMode && !isEdited) || !file || !fileName}
          className={`mt-4 py-2 px-4 rounded-lg w-full ${
            (editMode && !isEdited) || !file || !fileName
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
