import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LightPreview from "../../components/dashboard/ui/LightPreview";
import DarkPreview from "../../components/dashboard/ui/DarkPreview";
import UploadImageTab, { EditItem } from "./UploadImageTab";
import Dropdown, { DropdownItem } from "@/components/dashboard/ui/Dropdown";

function ViewImagesTab() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [previewModal, setPreviewModal] = useState<EditItem | null>(null);
  const [editModal, setEditModal] = useState<EditItem | null>(null);
  const [allImages, setAllImages] = useState<EditItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [selectedCategoryItem, setSelectedCategoryItem] =
    useState<DropdownItem | null>(null);
  const [selectedTournamentItem, setSelectedTournamentItem] =
    useState<DropdownItem | null>(null);
  const fetchImages = async () => {
    setEditModal(null);
    setIsLoading(true);
    try {
      const response = await axios.get("/api/getallimages", {
        params: {
          search: searchTerm,
          categoryId: category,
          tournamentId: tournament,
          page: currentPage,
          limit: 50,
        },
      });
      setAllImages(response?.data?.data);
      setTotalPages(response?.data?.metadata?.totalPages);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [searchTerm, category, tournament, currentPage]);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard!");
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (previewModal || editModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [previewModal, editModal]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mx-auto">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-blue-600 border-4 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">View and Edit</h2>

      <ToastContainer position="bottom-left" autoClose={3000} theme="colored" />

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search team/player name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-1/3"
        />
        <Dropdown
          apiEndpoint="/api/getallcategories?"
          placeholder="Select a category"
          value={selectedCategoryItem}
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          onChange={(option: any) => {
            setTournament(null);
            setSelectedTournamentItem(null);
            setSelectedCategoryItem(option);
            setCategory(option?.value);
          }}
        />
        <Dropdown
          apiEndpoint={`/api/getalltournaments?categoryId=${Number(category)}`}
          value={selectedTournamentItem}
          placeholder="Select a tournament"
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          onChange={(option: any) => {
            setSelectedTournamentItem(option);
            setTournament(option?.value);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Symbol</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Tournament</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allImages.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">{item.symbol}</td>
                <td className="border border-gray-300 p-2">
                  {item.category || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.tournament || "N/A"}
                </td>
                <td className="border border-gray-300 p-2 flex justify-center space-x-2">
                  <button
                    onClick={() => setPreviewModal(item)}
                    className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-500"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setEditModal(item)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-400"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-500"
                  >
                    Copy URL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="bg-gray-300 text-gray-700 py-1 px-3 rounded-lg hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-gray-300 text-gray-700 py-1 px-3 rounded-lg hover:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {previewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Preview - {previewModal.name}
            </h2>

            <div className="flex space-x-4">
              <LightPreview previewURL={previewModal.url} />
              <DarkPreview previewURL={previewModal.url} />
            </div>

            <button
              onClick={() => setPreviewModal(null)}
              className="bg-red-600 text-white mt-4 py-2 px-4 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Edit - {editModal.name}
            </h2>

            <UploadImageTab
              editMode={true}
              editItem={editModal}
              uploadHandler={fetchImages}
            />

            <button
              onClick={() => setEditModal(null)}
              className="bg-red-600 text-white mt-4 py-2 px-4 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewImagesTab;
