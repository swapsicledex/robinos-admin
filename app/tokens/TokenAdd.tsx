import DarkPreview from "@/components/dashboard/ui/DarkPreview";
import Dropdown, { DropdownItem } from "@/components/dashboard/ui/Dropdown";
import LightPreview from "@/components/dashboard/ui/LightPreview";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function TokenAdd() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  const [decimal, setDecimal] = useState<string>("18");
  const [isLoading, setIsLoading] = useState(false);

  // const [chains, setChains] = useState<Chain[]>([]);

  const [selectedChainItem, setSelectedChainItem] =
    useState<DropdownItem | null>(null);

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

  // const getAllData = async () => {
  //   try {
  //     const [chainRes] = await Promise.all([axios.get("/api/getallchains")]);

  //     setChains(chainRes.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   getAllData();
  // }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await axios.post("/api/savetoken", {
        address: address,
        symbol: symbol,
        name: name,
        chainId: chainId,
        decimal: decimal,
        image: `${process.env.NEXT_PUBLIC_CUSTOM_URL}/${fileNameWithExtension}`,
      });
      toast.success(`Token added successfully!`);
      // Reset the form after submission
      setSymbol("");
      setAddress("");
      setName("");
      setChainId(null);
    } catch (error) {
      toast.error(`Token add failed`);
      console.log("Error in pusing token data to db: ", error);
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
      <h2 className="text-2xl font-semibold mb-4">Add Token Details</h2>
      <form onSubmit={handleFormSubmit}>
        {/* Token Name */}
        <label className="block mb-2 font-medium">
          Token Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter token name"
            required
          />
        </label>
        {/* Token Symbol */}
        <label className="block mb-2 font-medium">
          Token Symbol
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter token symbol"
            required
          />
        </label>

        {/* Token Address */}
        <label className="block mb-2 font-medium">
          Token Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter token address"
            required
          />
        </label>

        {/* Decimal */}
        <label htmlFor="decimal" className="block font-medium mb-1">
          Decimal
        </label>
        <input
          type="number"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          id="decimal"
          name="decimal"
          value={decimal}
          onChange={(e) => setDecimal(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-2"
          min={0}
        />

        {/* Chain */}
        <label className="block mb-2 font-medium">
          Chain
          <Dropdown
            apiEndpoint="/api/getallchains?"
            value={selectedChainItem}
            placeholder="Search and select an image"
            valueKey="chainId"
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            onChange={(option: any) => {
              setSelectedChainItem(option);
              setChainId(option?.value);
            }}
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
            required
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
