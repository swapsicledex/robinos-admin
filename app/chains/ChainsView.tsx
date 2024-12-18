import { Chain } from "@/db/schema";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ChainsView() {
  const [allChains, setAllChains] = useState<Chain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAllChainsData = async () => {
    setIsLoading(true);
    const response = await axios.get("/api/getallchains");
    setIsLoading(false);
    setAllChains(response?.data?.data);
  };

  useEffect(() => {
    getAllChainsData();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-blue-600 border-4 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead className="bg-gray-100 border-b">
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Chain Name</th>
              <th className="px-4 py-2">Is Mainnet</th>
            </tr>
          </thead>
          <tbody>
            {allChains.length > 0 ? (
              allChains.map((chain) => (
                <tr key={chain.chainId} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{chain.name}</td>
                  <td className="p-4 text-gray-800">
                    {chain.isMainnet ? "Yes" : "No"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500 font-medium"
                >
                  No chains found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
