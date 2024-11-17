import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function TokenAdd() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/savetoken", {
        name: name,
        address: address,
        symbol: symbol,
        chainId: chainId,
      });
      toast.success(`Token added successfully!`);
      // Reset the form after submission
      setName("");
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

        {/* Chain ID */}
        <label className="block mb-2 font-medium">
          Chain ID
          <input
            type="number"
            value={chainId ?? ""}
            onChange={(e) => setChainId(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter chain ID"
            required
          />
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
