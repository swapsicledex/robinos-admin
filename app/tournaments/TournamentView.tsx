import { Tournament } from "@/db/schema";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function TournamentView() {
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAllTournamentsData = async () => {
    setIsLoading(true);
    const response = await axios.get("/api/getalltournaments");
    setIsLoading(false);
    setAllTournaments(response.data);
  };

  useEffect(() => {
    getAllTournamentsData();
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
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 font-semibold text-gray-600">
                Tournament
              </th>
              <th className="py-3 px-4 font-semibold text-gray-600">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {allTournaments.length > 0 ? (
              allTournaments.map((tournament) => (
                <tr key={tournament.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{tournament.name}</td>
                  <td className="p-4 text-gray-800">{tournament.category}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500 font-medium"
                >
                  No tournament found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
