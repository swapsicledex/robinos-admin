import Dropdown from "@/components/dashboard/ui/Dropdown";
import { Category } from "@/db/schema";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TournamentCreate() {
  const [tournament, setTournament] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const getAllData = async () => {
    setIsLoading(true);
    try {
      const categoriesData = await axios.get("/api/getallcategories");
      setCategories(categoriesData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournament.trim()) {
      alert("Tournament name is required.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/api/savetournament", {
        tournament: tournament,
        category:category
      });
      toast.success(`tournament added successfully!`);
      // Reset the form after submission
      setTournament("");
      setCategory("");
    } catch (error) {
      toast.error(`Tournament add failed`);
      console.log("Error in pusing tournament data to db: ", error);
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
      <h2 className="text-2xl font-semibold mb-4">Add Tournament</h2>
      <form
        onSubmit={handleFormSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-md w-full"
      >
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Tournament Name</span>
          <input
            type="text"
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
            placeholder="Enter tournament name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            required
          />
        </label>
        <label className="block mb-2 font-medium">
          Image
          <Dropdown
            items={categories.map((cat) => ({
              id: cat.id,
              name: cat.category,
            }))}
            placeholder="Search and select a category"
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            onChange={(value: any) => setCategory(value.id)}
          />
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
