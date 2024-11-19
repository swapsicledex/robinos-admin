import Dropdown from "@/components/ui/Dropdown";
import { Player } from "@/db/schema";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as chains from "viem/chains";

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
  const [images, setImages] = useState<Player[]>([]);
  const [chainImage, setChainImage] = useState<string | null>(null);
  const [chainImageId, setChainImageId] = useState<string | null>(null);

  const getAllData = async () => {
    setIsLoading(true);
    try {
      const [imagesData] = await Promise.all([axios.get("/api/getallimages")]);

      setImages(imagesData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);
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
    setChainImage(null);
    setChainImageId(null);
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
      await axios.post("/api/savechain", {
        name: formData.name,
        chainId: formData.chainId,
        explorerUrl: formData.explorerUrl,
        subdomainUrl: formData.subdomainUrl,
        isMainnet: formData.isMainnet,
        isActive: formData.isActive,
        versusAddress: formData.versusAddress,
        standardTokenAddress: formData.standardTokenAddress,
        image: chainImageId,
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
          Image
          <Dropdown
            items={images}
            placeholder="Search and select an image"
            onChange={(value: any) => {
              setChainImage(
                images.filter((image) => image.id.toString() == value.id)[0].url
              );
              setChainImageId(value.id);
            }}
          />
          {chainImage && (
            <img
              src={chainImage}
              alt="Tpken"
              className="w-24 h-24 mt-2 rounded-lg border border-gray-300"
            />
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
            required
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
