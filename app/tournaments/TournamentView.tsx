import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Dropdown, { DropdownItem } from "@/components/dashboard/ui/Dropdown";
import { Category, Tournament } from "@/db/schema";

export default function TournamentView() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editTournament, setEditTournament] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<DropdownItem | null>(
    null
  );
  const [editImage, setEditImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTournaments();
    fetchCategories();
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/getalltournaments");
      setTournaments(response.data.data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast.error("Failed to fetch tournaments.");
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/getallcategories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const handleEditClick = (tournament: any) => {
    setIsEditing(tournament.id);
    setEditTournament(tournament.name);
    const selectedCategory =
      categories.find((cat) => cat.name === tournament.category) || null;
    setSelectedCategory(
      selectedCategory
        ? { value: selectedCategory.id, label: selectedCategory.name }
        : null
    );
    setPreviewURL(tournament.imageUrl || null);
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
    if (!editTournament.trim()) {
      toast.error("Tournament name cannot be empty.");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }

    setIsLoading(true);
    try {
      if (editImage && preSignedUrl) {
        await axios.put(preSignedUrl, editImage, {
          headers: { "Content-Type": editImage.type },
        });
      }

      await axios.put(`/api/updatetournament`, {
        id: id,
        name: editTournament,
        categoryId: selectedCategory.value,
        imageUrl: newImageUrl || undefined,
      });

      toast.success("Tournament updated successfully!");
      fetchTournaments();
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating tournament:", error);
      toast.error("Failed to update tournament.");
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditTournament("");
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
      <h2 className="text-2xl font-semibold mb-4">Tournament List</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">Image</th>
            <th className="text-left py-2 px-4">Name</th>
            <th className="text-left py-2 px-4">Category</th>
            <th className="text-left py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament.id} className="border-b">
              <td className="py-2 px-4">
                {isEditing === tournament.id ? (
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
                        alt={editTournament}
                        className="h-12 w-12 object-cover rounded mt-2"
                        height={48}
                        width={48}
                      />
                    )}
                  </div>
                ) : tournament.imageUrl ? (
                  <Image
                    src={tournament.imageUrl}
                    alt={tournament.name}
                    className="h-12 w-12 object-cover rounded"
                    height={48}
                    width={48}
                  />
                ) : null}
              </td>
              <td className="py-2 px-4">
                {isEditing === tournament.id ? (
                  <input
                    type="text"
                    value={editTournament}
                    onChange={(e) => setEditTournament(e.target.value)}
                    className="border border-gray-300 rounded p-1 w-full"
                  />
                ) : (
                  tournament.name
                )}
              </td>
              <td className="py-2 px-4">
                {isEditing === tournament.id ? (
                  <Dropdown
                    value={selectedCategory}
                    apiEndpoint="/api/getallcategories?"
                    placeholder="Select a category"
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    onChange={(option: any) =>
                      setSelectedCategory(option)
                    }
                  />
                ) : (
                  tournament.category
                )}
              </td>
              <td className="py-2 px-4 space-x-2">
                {isEditing === tournament.id ? (
                  <>
                    <button
                      onClick={() => handleEditSave(tournament.id.toString())}
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
                    onClick={() => handleEditClick(tournament)}
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
