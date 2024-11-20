import { Event } from "@/db/schema";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function EventView() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAllEventsData = async () => {
    setIsLoading(true);
    const response = await axios.get("/api/getallevents");
    setIsLoading(false);
    setAllEvents(response.data);
  };

  useEffect(() => {
    getAllEventsData();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-blue-600 border-4 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">All Events</h2>

        {allEvents.length === 0 ? (
          <p className="text-gray-600">No events available.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b py-2 px-4">Event Name</th>
                <th className="border-b py-2 px-4">Sale End Time</th>
                <th className="border-b py-2 px-4">Chain Id</th>
              </tr>
            </thead>
            <tbody>
              {allEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="border-b py-2 px-4">{event.code}</td>
                  <td className="border-b py-2 px-4">
                    {new Date(
                      parseInt(event?.saleEnd?.toString() ?? "") * 1000
                    ).toLocaleString()}
                  </td>
                  <td className="border-b py-2 px-4">
                    {event.chainId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
