"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Dropdown, { DropdownItem } from "@/components/dashboard/ui/Dropdown";
import DateTimePicker from "@/components/dashboard/ui/DateTimePicker";
import { Category, Tournament } from "@/db/schema";

type FormData = {
  id: number;
  code: string;
  chainId: number;
  isFeatured: boolean;
  saleStart: number | null;
  saleEnd: number;
  category: number;
  tournament: number | null;
  conditions: string[];
};

export default function EventList() {
  const [events, setEvents] = useState<FormData[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/getallevents");
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuxiliaryData = async () => {
    try {
      const [categoriesData, tournamentsData] = await Promise.all([
        axios.get("/api/getallcategories"),
        axios.get("/api/getalltournaments"),
      ]);
      setCategories(categoriesData.data);
      setTournaments(tournamentsData.data);
    } catch (error) {
      console.error("Error fetching auxiliary data:", error);
    }
  };

  const updateEvent = async (updatedData: FormData) => {
    try {
      await axios.put("/api/updateevent", updatedData);
      toast.success("Event updated successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event.");
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchAuxiliaryData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">All Events</h2>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Event Name</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Tournament</th>
              <th className="border border-gray-300 p-2">Chain Id</th>
              <th className="border border-gray-300 p-2">Sale End</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody key="body">
            {events.map((event, index) => (
              <>
                <tr
                  key={event.id}
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedRow(expandedRow === index ? null : index)
                  }
                >
                  <td className="border border-gray-300 p-2">{event.code}</td>
                  <td className="border border-gray-300 p-2">
                    {categories.find((cat) => cat.id === event.category)?.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {
                      tournaments.find((tour) => tour.id === event.tournament)
                        ?.name
                    }
                  </td>
                  <td className="border border-gray-300 p-2">
                    {event.chainId}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(event.saleEnd * 1000).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {expandedRow === index ? "-" : "+"}
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-gray-300 p-4 bg-gray-50"
                    >
                      <EditEventForm
                        event={event}
                        categories={categories}
                        tournaments={tournaments}
                        onUpdate={updateEvent}
                      />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function EditEventForm({
  event,
  onUpdate,
}: {
  event: FormData;
  categories: Category[];
  tournaments: Tournament[];
  onUpdate: (updatedData: FormData) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    ...event,
    saleStart: event.saleStart || null,
  });

  const [selectedCategoryItem, setSelectedCategoryItem] =
    useState<DropdownItem | null>(null);
  const [selectedTournamentItem, setSelectedTournamentItem] =
    useState<DropdownItem | null>(null);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleConditionChange = (index: number, value: string) => {
    const updatedConditions = [...formData.conditions];
    updatedConditions[index] = value;
    setFormData({ ...formData, conditions: updatedConditions });
  };

  const addCondition = () => {
    setFormData({ ...formData, conditions: [...formData.conditions, ""] });
  };

  const removeCondition = (index: number) => {
    const updatedConditions = formData.conditions.filter((_, i) => i !== index);
    setFormData({ ...formData, conditions: updatedConditions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block font-medium">Event Code</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => handleInputChange("code", e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Sale Start Time</label>
        <DateTimePicker
          initialDateTime={
            formData.saleStart ? new Date(formData.saleStart * 1000) : undefined
          }
          onDateTimeChange={(date) =>
            handleInputChange("saleStart", Math.floor(date.getTime() / 1000))
          }
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Sale End Time</label>
        <DateTimePicker
          initialDateTime={new Date(formData.saleEnd * 1000)}
          onDateTimeChange={(date) =>
            handleInputChange("saleEnd", Math.floor(date.getTime() / 1000))
          }
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Category</label>
        <Dropdown
          apiEndpoint="/api/getallcategories?"
          value={selectedCategoryItem}
          placeholder="Select a category"
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          onChange={(option: any) => {
            setSelectedCategoryItem(option);
            handleInputChange("category", option.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Tournament</label>
        <Dropdown
          apiEndpoint={`/api/getalltournaments?categoryId`}
          value={selectedTournamentItem}
          placeholder="Select a tournament"
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          onChange={(option: any) => {
            setSelectedTournamentItem(option);
            handleInputChange("tournament", option.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
          />
          <span className="font-medium">Featured Event</span>
        </label>
      </div>

      <fieldset className="border border-gray-200 p-4 rounded-lg space-y-4">
        <legend className="font-medium text-lg">Conditions</legend>
        {formData.conditions.map((condition, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={condition}
              onChange={(e) => handleConditionChange(index, e.target.value)}
              className="border border-gray-300 rounded-lg p-3 flex-1"
            />
            <button
              type="button"
              onClick={addCondition}
              className="bg-green-500 text-white p-2 rounded-lg"
            >
              +
            </button>
            {formData.conditions.length > 1 && (
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="bg-red-500 text-white p-2 rounded-lg"
              >
                -
              </button>
            )}
          </div>
        ))}
      </fieldset>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full"
      >
        Save Changes
      </button>
    </form>
  );
}
