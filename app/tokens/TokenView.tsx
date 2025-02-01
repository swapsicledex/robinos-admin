import axios from "axios";
import React, { useEffect, useState } from "react";
import { TokenResponse } from "../types/TokenResponse";

export default function TokenView() {
  const [allTokens, setAllTokens] = useState<TokenResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAllTokensData = async () => {
    setIsLoading(true);
    const response = await axios.get("/api/getalltokens");
    setIsLoading(false);
    setAllTokens(response?.data?.data);
  };

  useEffect(() => {
    getAllTokensData();
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
            <tr>
              <th className="p-4 text-left text-gray-700 font-medium">
                Symbol
              </th>
              <th className="p-4 text-left text-gray-700 font-medium">
                Chain
              </th>
              <th className="p-4 text-left text-gray-700 font-medium">
                Decimal
              </th>
            </tr>
          </thead>
          <tbody>
            {allTokens.length > 0 ? (
              allTokens.map((token) => (
                <tr key={token.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{token.symbol}</td>
                  <td className="p-4 text-gray-800">{token.chainName}</td>
                  <td className="p-4 text-gray-800">{token.decimal}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500 font-medium"
                >
                  No tokens found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
