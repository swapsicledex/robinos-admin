"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewImagesTab from "@/components/ui/ViewImagesTab";

function Home() {
  const [currentTab, setCurrentTab] = useState("upload");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null);
  const [fileNameWithExtension, setFileNameWithExtension] = useState<
    string | null
  >(null);

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
    const file = e.target.files?.[0];
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
      setFileHandler(file);
    } else {
      setPreviewURL(null);
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (file && preSignedUrl) {
      try {
        await axios.put(preSignedUrl, file, {
          headers: { "Content-Type": file.type },
        });
        await axios.post("/api/saveimageurl", {
          name: fileName,
          imageName: fileNameWithExtension,
        });

        toast.success(`File uploaded successfully!`);
        setPreviewURL(null);
        setFile(null);
        setFileName("");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file.");
      }
    }
  };

  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen p-10 flex flex-col items-center">
      
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full max-w-4xl"
      >
        <ToastContainer position="bottom-left" autoClose={3000} theme="colored" />
        <TabsList className="flex space-x-4 bg-white p-4 rounded-lg shadow mb-8">
          <TabsTrigger
            value="upload"
            className="flex-1 text-center p-2 bg-gray-100 rounded-md"
          >
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="flex-1 text-center p-2 bg-gray-100 rounded-md"
          >
            View
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="upload"
          className="p-6 bg-white rounded-lg shadow-md w-full flex flex-col gap-4"
        >
          <h2 className="text-2xl font-semibold mb-4">Upload and Preview</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-1 w-64"
            required
          />

          <label className="text-gray-600">Team/Player Name</label>
          <input
            type="text"
            placeholder="Enter team/player name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-48"
            required
          />

          {previewURL && (
            <div className="flex space-x-4 mt-6 justify-center">
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
                      src={previewURL}
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
                      src={previewURL}
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
                      <div className="text-20 text-white font-medium">1.18</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || !fileName}
            className={`mt-4 py-2 px-4 rounded-lg w-full ${
              !file || !fileName
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            Upload
          </button>
        </TabsContent>

        <TabsContent
          value="other"
          className="p-6 bg-white rounded-lg shadow-md w-full pt-0"
        >
          <ViewImagesTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default Home;
