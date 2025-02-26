"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Dropdown, { DropdownItem } from "@/components/dashboard/ui/Dropdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type FormData = {
  id: number;
  eventCode: string;
  chainId: number;
  isFeatured: boolean;
  isDeleted: boolean;
  saleStart: number | null;
  saleEnd: number;
  category: string;
  tournament: string | null;
  conditions: string[];
  categoryId: number;
  tournamentId: number;
};

type EventFilterParams = {
  chainId: number | null;
  search: string;
  categoryId: number | null;
  tournamentId: number | null;
  page: number;
  limit: number;
  fromTime?: number;
  deleted?: boolean;
};

export default function DeletedEvents() {
  const [events, setEvents] = useState<FormData[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [chain, setChain] = useState(40);
  const [category, setCategory] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedChainItem, setSelectedChainItem] =
    useState<DropdownItem | null>({ label: "Telos", value: 40 });
  const [selectedCategoryItem, setSelectedCategoryItem] =
    useState<DropdownItem | null>(null);
  const [selectedTournamentItem, setSelectedTournamentItem] =
    useState<DropdownItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLiveEventsOnly, setShowLiveEventsOnly] = useState<boolean>(false); // New state

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params: EventFilterParams = {
        chainId: chain,
        search: searchQuery,
        categoryId: category,
        tournamentId: tournament,
        page: currentPage,
        limit: 50,
        deleted: true
      };
      if (showLiveEventsOnly) {
        params["fromTime"] = Math.floor(Date.now() / 1000);
      }
      const { data } = await axios.get("/api/geteventdata", {
        params: params,
      });

      setEvents(data?.data);
      setTotalPages(data.metadata.totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchEvents();
  }, [
    currentPage,
    searchQuery,
    category,
    tournament,
    chain,
    showLiveEventsOnly,
  ]); // Include `showLiveEventsOnly` in dependencies

  const toggleLiveEventsFilter = () => {
    setShowLiveEventsOnly((prev) => !prev);
    setCurrentPage(1); // Reset to first page when toggling filter
  };

  const updateEvent = async (
    updatedData: FormData,
    catId: number,
    torId: number
  ) => {
    try {
      await axios.put("/api/updateevent", {
        id: updatedData.id,
        code: updatedData.eventCode,
        saleEnd: updatedData.saleEnd,
        saleStart: updatedData.saleStart,
        isFeatured: updatedData.isFeatured,
        isDeleted: false,
        category: catId,
        conditions: updatedData.conditions,
        tournament: torId,
      });
      toast.success("Event Redeployed successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Error Redeploying event:", error);
      toast.error("Failed to Redeploy event.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">All Events</h2>

      <div className="mb-6 flex space-x-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events..."
          className="border border-gray-300 rounded-lg p-3 w-1/3"
        />
        <Dropdown
          apiEndpoint={`/api/getallchains?`}
          placeholder="Filter by Chain"
          value={selectedChainItem}
          valueKey="chainId"
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          onChange={(option: any) => {
            setChain(option?.value);
            setSelectedChainItem(option);
          }}
        />
        <Dropdown
          apiEndpoint="/api/getallcategories?"
          placeholder="Filter by Category"
          value={selectedCategoryItem}
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          onChange={(option: any) => {
            setCategory(option?.value);
            setSelectedCategoryItem(option);
          }}
        />
        <Dropdown
          apiEndpoint={`/api/getalltournaments?categoryId=${category}`}
          placeholder="Filter by Tournament"
          value={selectedTournamentItem}
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          onChange={(option: any) => {
            setTournament(option?.value);
            setSelectedTournamentItem(option);
          }}
        />
        <button
          onClick={toggleLiveEventsFilter}
          className={`${showLiveEventsOnly ? "bg-blue-500 text-white" : "bg-gray-300"
            } px-2 py-2 rounded-md`}
        >
          {showLiveEventsOnly ? "Show All Events" : "Show Live Events"}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Event Name</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Tournament</th>
              <th className="border border-gray-300 p-2">Sale End</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <React.Fragment key={index}>
                <tr
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedRow(expandedRow === index ? null : index)
                  }
                >
                  <td className="border border-gray-300 p-2">
                    {event.eventCode}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {event.category}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {event.tournament}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(event.saleEnd * 1000).toLocaleString()}
                  </td>
                  <td className="border border-gray-300">
                    <RedeployEvent event={event} onUpdate={updateEvent}/>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function RedeployEvent({
  event,
  onUpdate
}: {
  event: FormData;
  onUpdate: (updatedData: FormData, catId:number, torId:number) => void;
}) {
  
  const handleEventRedeploy = () => {
    onUpdate(event, event.categoryId, event.tournamentId);
  }
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-green-600 text-white py-6 rounded-lg w-full mt-2"
          >Redeploy</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className="bg-white"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              Redeploy {event.eventCode}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will redeploy the Event : {event.eventCode}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 text-white hover:text-black"
              onClick={handleEventRedeploy}
            >Redeploy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}