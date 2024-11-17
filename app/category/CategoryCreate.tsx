import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function CategoryCreate() {
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) {
      alert("Category name is required.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/api/savecategory", {
        category: category,
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
