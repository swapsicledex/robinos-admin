import Dropdown from "@/components/ui/Dropdown";
import { Chain, Player } from "@/db/schema";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TokenAdd() {
  const [symbol, setSymbol] = useState("");
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  const [decimal, setDecimal] = useState<string>("18");
  const [isLoading, setIsLoading] = useState(false);

  const [chains, setChains] = useState<Chain[]>([]);
  const [images, setImages] = useState<Player[]>([]);
  const [tokenImage, setTokenImage] = useState<string | null>(null);
  const [tokenImageId, setTokenImageId] = useState<string | null>(null);

  const getAllData = async () => {
    try {
      const [chainRes, playerRes] = await Promise.all([
        axios.get("/api/getallchains"),
        axios.get("/api/getallimages"),
      ]);

      setChains(chainRes.data);
      setImages(playerRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/savetoken", {
        address: address,
        symbol: symbol,
        chainId: chainId,
        decimal: decimal,
        image: tokenImageId,
      });
      toast.success(`Token added successfully!`);
      // Reset the form after submission
      setSymbol("");
      setAddress("");
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
            items={chains.map((chain) => ({
              id: chain.chainId,
              name: chain.name,
            }))}
            placeholder="Search and select an image"
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            onChange={(value: any) => setChainId(value.id)}
          />
        </label>

        {/* Image */}
        <label className="block mb-2 font-medium">
          Image
          <Dropdown
            items={images}
            placeholder="Search and select an image"
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            onChange={(value: any) => {
              setTokenImage(
                images.filter((image) => image.id.toString() == value.id)[0].url
              );
              setTokenImageId(value.id);
            }}
          />
          {tokenImage && (
            <img
              src={tokenImage}
              alt="Tpken"
              className="w-24 h-24 mt-2 rounded-lg border border-gray-300"
            />
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
