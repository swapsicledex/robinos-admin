import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as chains from "viem/chains";
import { v4 as uuidv4 } from "uuid";
import LightPreview from "@/components/dashboard/ui/LightPreview";
import DarkPreview from "@/components/dashboard/ui/DarkPreview";

export default function ChainAdd() {
  const [formData, setFormData] = useState({
    name: "",
    chainId: "",
    explorerUrl: "",
    subdomainUrl: "",
    isActive: false,
    isMainnet: false,
    versusAddress: "",
    standardTokenAddress: "",
  });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetFormdata = () => {
    setFormData({
      name: "",
      chainId: "",
      explorerUrl: "",
      subdomainUrl: "",
      isActive: false,
      isMainnet: false,
      versusAddress: "",
      standardTokenAddress: "",
    });
  };

  const handleChainIdBlur = () => {
    const chainsArray = Object.values(chains);
    const chain = chainsArray.find((x) => x.id == Number(formData.chainId));
    // console.log("chain: ", chain);
    if (chain) {
      setFormData((prev) => ({
        ...prev,
        name: chain?.name,
        explorerUrl: chain?.blockExplorers?.default?.url ?? "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        explorerUrl: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      await axios.post("/api/savechain", {
        name: formData.name,
        chainId: formData.chainId,
        explorerUrl: formData.explorerUrl,
        subdomainUrl: formData.subdomainUrl,
        isMainnet: formData.isMainnet,
        isActive: formData.isActive,
        versusAddress: formData.versusAddress,
        standardTokenAddress: formData.standardTokenAddress,
        image: `${process.env.NEXT_PUBLIC_CUSTOM_URL}/${fileNameWithExtension}`,
      });
      toast.success(`Chain added successfully!`);
      // Reset the form after submission
      resetFormdata();
    } catch (error) {
      toast.error(`Chain add failed`);
      console.log("Error in pusing chain data to db: ", error);
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
      <h2 className="text-2xl font-semibold mb-4">Add Chain Details</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Add Chain</h2>

        {/* Chain ID */}
        <label className="block mb-2 font-medium">
          Chain ID
          <input
            type="number"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            name="chainId"
            value={formData.chainId}
            onChange={handleChange}
            onBlur={handleChainIdBlur}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </label>

        {/* Name */}
        <label className="block mb-2 font-medium">
          Chain Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
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
        {/* Explorer URL */}
        <label className="block mb-2 font-medium">
          Explorer URL
          <input
            type="text"
            name="explorerUrl"
            value={formData.explorerUrl}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </label>

        {/* Subdomain URL */}
        <label className="block mb-2 font-medium">
          Subdomain URL
          <input
            type="text"
            name="subdomainUrl"
            value={formData.subdomainUrl}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </label>

        {/* Is Active */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="border border-gray-300 rounded"
          />
          <span>Is Active</span>
        </label>

        {/* Is Mainnet */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="isMainnet"
            checked={formData.isMainnet}
            onChange={handleChange}
            className="border border-gray-300 rounded"
          />
          <span>Is Mainnet</span>
        </label>

        {/* Versus Address */}
        <label className="block mb-2 font-medium">
          Versus Address
          <input
            type="text"
            name="versusAddress"
            value={formData.versusAddress}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </label>

        {/* Standard Token Address */}
        <label className="block mb-2 font-medium">
          Standard Token Address
          <input
            type="text"
            name="standardTokenAddress"
            value={formData.standardTokenAddress}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </label>

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
