"use client";

import { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import { Player } from "@/components/ViewImagesTab";
import { Category } from "../category/page";
import { Token } from "../tokens/page";

import Dropdown from "@/components/ui/Dropdown";
import { toast } from "react-toastify";

export default function EventCreate() {
  const [eventName, setEventName] = useState("");
  const [saleEndTime, setSaleEndTime] = useState("");
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAImage, setTeamAImage] = useState<string | null>(null);
  const [teamBImage, setTeamBImage] = useState<string | null>(null);
  const [teamAId, setTeamAId] = useState<string | null>(null);
  const [teamBId, setTeamBId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [token, setToken] = useState("");

  const [images, setImages] = useState<Player[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllData = async () => {
    setIsLoading(true);
    try {
      const [imagesData, categoriesData, tokensData] = await Promise.all([
        axios.get("/api/getallimages"),
        axios.get("/api/getallcategories"),
        axios.get("/api/getalltokens"),
      ]);

      setImages(imagesData.data);
      setCategories(categoriesData.data);
      setTokens(tokensData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/saveevent", {
        code: eventName,
        saleEnd: saleEndTime,
        isDeployed: false,
        teamAId: teamAId,
        teamBId: teamBId,
        tokenAddressId: token,
        categoryId: category,
      });
      toast.success(`Event created successfully!`);
      handleReset();
    } catch (error) {
      toast.error(`Event creating error`);
      console.log("Error in pusing event data to db: ", error);
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setEventName("");
    setSaleEndTime("");
    setTeamAName("");
    setTeamAImage(null);
    setTeamBName("");
    setTeamBImage(null);
    setCategory("");
    setToken("");
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-blue-600 border-4 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      <form
        onSubmit={handleFormSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>

        {/* Event Details Section */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <legend className="text-lg font-medium text-gray-700 px-2">
            Event Details
          </legend>

          <label className="block mb-4 font-medium">
            Event Name
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mt-1"
              required
            />
          </label>

          <label className="block font-medium">
            Sale End Time (Unix Timestamp)
            <input
              type="number"
              value={saleEndTime}
              onChange={(e) => setSaleEndTime(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mt-1"
              placeholder="Enter a timestamp in seconds"
              required
            />
          </label>
          <Dropdown
            items={categories.map((cat) => ({
              id: cat.id,
              name: cat.category,
            }))}
            label="Category"
            placeholder="Search and select a category"
            onChange={setCategory}
          />

          <Dropdown
            items={tokens.map((tok) => ({ id: tok.id, name: tok.name }))}
            label="Token"
            placeholder="Search and select a token"
            onChange={setToken}
          />
        </fieldset>

        {/* Team A Section */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <legend className="text-lg font-medium text-gray-700 px-2">
            Team A
          </legend>

          <label className="block mb-4 font-medium">
            Team A Name
            <input
              type="text"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mt-1"
              required
            />
          </label>

          <Dropdown
            items={images}
            label="Team A Image"
            placeholder="Search and select an image"
            onChange={(value) => {
              setTeamAImage(
                images.filter((image) => image.id.toString() == value)[0].url
              );
              setTeamAId(value);
            }}
          />
          {teamAImage && (
            <img
              src={teamAImage}
              alt="Team A"
              className="w-24 h-24 mt-2 rounded-lg border border-gray-300"
            />
          )}
        </fieldset>

        {/* Team B Section */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <legend className="text-lg font-medium text-gray-700 px-2">
            Team B
          </legend>

          <label className="block mb-4 font-medium">
            Team B Name
            <input
              type="text"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mt-1"
              required
            />
          </label>

          <Dropdown
            items={images}
            label="Team B Image"
            placeholder="Search and select an image"
            onChange={(value) => {
              setTeamBImage(
                images.filter((image) => image.id.toString() == value)[0].url
              );
              setTeamBId(value);
            }}
          />
          {teamBImage && (
            <img
              src={teamBImage}
              alt="Team B"
              className="w-24 h-24 mt-2 rounded-lg border border-gray-300"
            />
          )}
        </fieldset>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          disabled={isLoading}
        >
          Create Event
        </button>
      </form>
    </>
  );
}
