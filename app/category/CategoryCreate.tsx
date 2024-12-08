import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import LightPreview from "@/components/dashboard/ui/LightPreview";
import DarkPreview from "@/components/dashboard/ui/DarkPreview";

export default function CategoryCreate() {
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null);
  const [fileNameWithExtension, setFileNameWithExtension] = useState<
    string | null
  >(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) {
      alert("Category name is required.");
      return;
    }
    setIsLoading(true);
    try {
      if (file && preSignedUrl) {
        try {
          await axios.put(preSignedUrl, file, {
            headers: { "Content-Type": file.type },
          });
          setPreviewURL(null);
          setFile(null);
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Error uploading file.");
        }
      }
      await axios.post("/api/savecategory", {
        category: category,
        image: `${process.env.NEXT_PUBLIC_CUSTOM_URL}/${fileNameWithExtension}`,
      });
      toast.success(`Category added successfully!`);
      // Reset the form after submission
      setCategory("");
    } catch (error) {
      toast.error(`Category add failed`);
      console.log("Error in pusing category data to db: ", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-blue-600 border-4 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
      <form
        onSubmit={handleFormSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-md w-full"
      >
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Category Name</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            required
          />
        </label>

        {/* Image */}
        <label className="block mb-2 font-medium">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-1 w-64"
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
