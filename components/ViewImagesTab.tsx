import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import { deleteobject } from "@/utils/deleteObject";
import LightPreview from "./ui/LightPreview";
import DarkPreview from "./ui/DarkPreview";
import UploadImageTab from "./UploadImageTab";

export type Player = {
  id: number;
  name: string;
  url: string;
  created_at: Date;
  updated_at: Date;
};
function ViewImagesTab() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [previewModal, setPreviewModal] = useState<Player | null>(null);
  const [editModal, setEditModal] = useState<Player | null>(null);
  const [allImages, setAllImages] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredData: Player[] = allImages.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAllImagesData = async () => {
    setIsLoading(true);
    const response = await axios.get("/api/getallimages");
    setIsLoading(false);
    setAllImages(response.data);
  };

  useEffect(() => {
    getAllImagesData();
  }, []);
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard!");
  };
  const uploadHandler = () => {
    setEditModal(null);
    getAllImagesData();
  };
  // const handleDelete = async (url: string, id: number) => {
  //   setIsLoading(true);
  //   try {
  //     const deletedFromR2 = await deleteobject(url.split("/").at(-1) ?? "");
  //     if (deletedFromR2) {
  //       await axios.delete("/api/deleteimage");
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete: ", error);
  //   }
  //   setIsLoading(false);
  // };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mx-auto">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-blue-600 border-4 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">View and Edit</h2>
      <div className="p-6 bg-gray-50 rounded-lg shadow-md w-full">
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          theme="colored"
        />

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search team/player name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        {/* Grid Layout */}
        {isLoading ? (
          <h6>Fetching data...</h6>
        ) : (
          <div className="flex flex-col">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md"
              >
                {/* Team/Player Name */}
                <div className="flex-1 w-1/2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                </div>

                {/* Buttons */}
                <div className="flex w-1/2 justify-between">
                  <button
                    onClick={() => setPreviewModal(item)}
                    className="bg-blue-600 text-white p-2 w-24 rounded-lg hover:bg-blue-500"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setEditModal(item)}
                    className="bg-yellow-500 text-white p-2 w-24 rounded-lg hover:bg-yellow-400"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="bg-green-600 text-white p-2 w-24 rounded-lg hover:bg-green-500"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {previewModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
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

        {/* Edit Modal */}
        {editModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">
                Edit - {editModal.name}
              </h2>

              <UploadImageTab
                editMode={true}
                editId={editModal.id}
                editName={editModal.name}
                editUrl={editModal.url}
                uploadHandler={uploadHandler}
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
    </div>
  );
}

export default ViewImagesTab;
