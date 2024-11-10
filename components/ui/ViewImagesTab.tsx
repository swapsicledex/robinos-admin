import { useEffect, useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

type Player = {
  id: number;
  name: string;
  url: string;
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

  return (
    <div>
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
                <div className="flex-1 w-2/3">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                </div>

                {/* Buttons */}
                <div className="flex w-1/3 justify-between">
                  <button
                    onClick={() => setPreviewModal(item)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setEditModal(item)}
                    disabled
                    className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-500"
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
                {/* Light Mode Preview */}
                <div className="flex items-center space-x-2 bg-slate-gradient rounded-[15px] relative border-slate-light">
                  <div className=" p-[15px] pt-[20px] w-full">
                    {/* Name */}
                    <div className="relative flex place-content-center">
                      <div className="text-14 font-medium text-center mb-4 truncate w-auto inline">
                        TEST
                      </div>
                      <span className="text-14 font-medium ml-[5px] positive">
                        0.5
                      </span>
                      <span className="text-14 font-medium ml-[5px] negative">
                        -0.5
                      </span>
                    </div>

                    {/* Image */}
                    <div className="h-100 w-100 mx-auto mb-4">
                      <Image
                        src={previewModal.url}
                        width={100}
                        height={100}
                        alt="Light Preview"
                      />
                    </div>

                    {/* ROI */}
                    <div className="flex place-content-between items-end">
                      <div>
                        <div className="text-14 text-black mb-1 font-regular">
                          ROI
                        </div>
                        <div className="text-20 font-medium">1.18</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dark Mode Preview */}
                <div className="flex items-center space-x-2 bg-darkblue-500 rounded-[15px] relative">
                  <div className=" p-[15px] pt-[20px] w-full">
                    {/* Name */}
                    <div className="relative flex place-content-center">
                      <div className="text-14 text-white font-medium text-center mb-4 truncate w-auto inline">
                        TEST
                      </div>
                      <span className="text-14 text-white font-medium ml-[5px] positive">
                        0.5
                      </span>
                      <span className="text-14 text-white font-medium ml-[5px] negative">
                        -0.5
                      </span>
                    </div>

                    {/* Image */}
                    <div className="h-100 w-100 mx-auto mb-4">
                      <Image
                        src={previewModal.url}
                        width={100}
                        height={100}
                        alt="Light Preview"
                      />
                    </div>

                    {/* ROI */}
                    <div className="flex place-content-between items-end">
                      <div>
                        <div className="text-14 text-slate-400 mb-1 font-regular">
                          ROI
                        </div>
                        <div className="text-20 text-white font-medium">
                          1.18
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  // Handle new image selection
                  const file = e.target.files?.[0];
                  if (file) {
                    // Dummy logic to mimic API call
                    toast.success("Image uploaded successfully!");
                    setEditModal(null);
                  }
                }}
                className="border border-gray-300 rounded-lg p-2 w-full"
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
