import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Category } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function CategoryView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/getallcategories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
    setIsLoading(false);
  };

  const handleEditClick = (category: Category) => {
    setIsEditing(category.id);
    setEditName(category.name);
    setPreviewURL(category.imageUrl ?? "");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      setPreviewURL(URL.createObjectURL(file));

      const randomFileName = uuidv4();
      const extension = file.name.split(".").pop();
      const fullName = `${randomFileName}.${extension}`;
      try {
        const response = await axios.get(`/api/getuploadurl?name=${fullName}`);
        setPreSignedUrl(response.data.url);
        setNewImageUrl(`${process.env.NEXT_PUBLIC_CUSTOM_URL}/${fullName}`);
      } catch (error) {
        console.error("Error getting pre-signed URL:", error);
        toast.error("Failed to get upload URL.");
      }
    }
  };

  const handleEditSave = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      if (editImage && preSignedUrl) {
        await axios.put(preSignedUrl, editImage, {
          headers: { "Content-Type": editImage.type },
        });
      }

      await axios.put(`/api/updatecategory`, {
        id: id,
        name: editName,
        imageUrl: newImageUrl || undefined,
      });

      toast.success("Category updated successfully!");
      fetchCategories();
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category.");
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditName("");
    setEditImage(null);
    setPreviewURL(null);
    setPreSignedUrl(null);
    setNewImageUrl(undefined);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-blue-600 border-4 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">Category List</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">Image</th>
            <th className="text-left py-2 px-4">Name</th>
            <th className="text-left py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b">
              <td className="py-2 px-4">
                {isEditing === category.id ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border border-gray-300 rounded p-1 w-full"
                    />
                    {previewURL && (
                      <Image
                        src={previewURL}
                        alt={editName}
                        className="h-12 w-12 object-cover rounded mt-2"
                        height={48}
                        width={48}
                      />
                    )}
                  </div>
                ) : category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-12 w-12 object-cover rounded"
                    height={48}
                    width={48}
                  />
                ) : null}
              </td>
              <td className="py-2 px-4">
                {isEditing === category.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border border-gray-300 rounded p-1 w-full"
                  />
                ) : (
                  category.name
                )}
              </td>
              <td className="py-2 px-4 space-x-2">
                {isEditing === category.id ? (
                  <>
                    <button
                      onClick={() => handleEditSave(category.id.toString())}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditClick(category)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
