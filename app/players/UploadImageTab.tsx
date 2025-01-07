import React, { useEffect } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";
import LightPreview from "@/components/dashboard/ui/LightPreview";
import DarkPreview from "@/components/dashboard/ui/DarkPreview";
import Dropdown, { DropdownItem } from "@/components/dashboard/ui/Dropdown";

export type EditItem = {
  id: number;
  name: string;
  symbol: string;
  url: string;
  category: string;
  categoryId: number;
  tournament: string;
  tournamentId: number;
};
export default function UploadImageTab({
  editMode,
  editItem,
  uploadHandler,
}: {
  editMode: boolean;
  editItem: EditItem | null;
  uploadHandler: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null);
  const [fileNameWithExtension, setFileNameWithExtension] = useState<
    string | null
  >(null);
  const [isImageEdited, setIsImageEdited] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [symbol, setSymbol] = useState("");
  const [tournament, setTournament] = useState<number | null>(null);
  const [selectedTournamentItem, setSelectedTournamentItem] =
    useState<DropdownItem | null>(null);

  const [selectedCategoryItem, setSelectedCategoryItem] =
    useState<DropdownItem | null>(null);

  // const getAllCategoriesData = async () => {
  //   setIsLoading(true);
  //   const response = await axios.get("/api/getallcategories");
  //   setIsLoading(false);
  //   setAllCategories(response.data);
  // };

  useEffect(() => {
    // getAllCategoriesData();
    if (editMode && editItem) {
      setIsLoading(true);
      try {
        setPreviewURL(editItem.url);
        setFileName(editItem.name);
        uploadFileFromUrl(editItem.url, editItem.name);
        setSymbol(editItem.symbol);
        setSelectedCategory(editItem.categoryId);
        setSelectedCategoryItem({
          value: editItem.categoryId,
          label: editItem.category,
        });
        setTournament(editItem.tournamentId);
        setSelectedTournamentItem({
          value: editItem.tournamentId,
          label: editItem.tournament,
        });
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
    setIsImageEdited(true);
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
    if (editMode && !isImageEdited) {
      console.log("image not updated")
      try {
        await axios.put("/api/updateimage", {
          id: editItem?.id,
          name: fileName,
          symbol: symbol,
          category: selectedCategory,
          tournament: tournament,
        });
        uploadHandler();
        toast.success(`Details updated successfully!`);
      } catch {
        toast.error("Error updating file.");
      }
      return;
    }
    if (file && preSignedUrl) {
      console.log("image updated")
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
            symbol: symbol,
            category: selectedCategory,
            tournament: tournament,
          });
          toast.success(`Details updated successfully!`);
          uploadHandler();
        } else {
          await axios.post("/api/saveimageurl", {
            name: fileName,
            imageName: fileNameWithExtension,
            symbol: symbol,
            category: selectedCategory,
            tournament: tournament,
          });
          toast.success(`File uploaded successfully!`);
        }

        setPreviewURL(null);
        setFile(null);
        setFileName("");
        setSelectedCategory(null);
        setTournament(null);
        setSelectedCategoryItem(null);
        setSelectedTournamentItem(null);
        setSymbol("");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file.");
      }
      setIsLoading(false);
    }
  };

  async function uploadFileFromUrl(url: string, name: string) {
    console.log("uploadFileFromUrl: ",url)
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
            onChange={(e) => {
              setIsEdited(true);
              setSymbol(e.target.value);
            }}
            className="border border-gray-300 rounded-lg p-2 w-full mt-1"
            placeholder="Enter player symbol"
            required
          />
        </label>
        {/* Category Dropdown */}
        <label className="block mb-2 font-medium">
          Category
          <Dropdown
            apiEndpoint="/api/getallcategories?"
            value={selectedCategoryItem}
            placeholder="Choose a category"
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            onChange={(option: any) => {
              setIsEdited(true);
              setSelectedCategoryItem(option);
              setSelectedCategory(option?.value);
            }}
          />
        </label>
        <label className="block mb-4 font-medium">
          Tournament
          <Dropdown
            apiEndpoint={`/api/getalltournaments?categoryId=${Number(
              selectedCategory
            )}`}
            value={selectedTournamentItem}
            placeholder="Search and select a tournament"
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            onChange={(option: any) => {
              setIsEdited(true);
              setSelectedTournamentItem(option);
              setTournament(option.value);
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
            required={!editMode}
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
          disabled={
            (editMode && !isEdited) ||
            (!editMode && !file) ||
            (!editMode && !fileName)
          }
          className={`mt-4 py-2 px-4 rounded-lg w-full ${
            (editMode && !isEdited) ||
            (!editMode && !file) ||
            (!editMode && !fileName)
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
