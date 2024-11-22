"use client";

import { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import Dropdown from "@/components/ui/Dropdown";
import { toast } from "react-toastify";
import { Category, Chain, Player, Token } from "@/db/schema";
import Image from "next/image";

export default function EventCreate() {
  const [eventName, setEventName] = useState("");
  const [saleEndTime, setSaleEndTime] = useState("");
  const [teamAImage, setTeamAImage] = useState<string | null>(null);
  const [teamBImage, setTeamBImage] = useState<string | null>(null);
  const [teamAId, setTeamAId] = useState<string | null>(null);
  const [teamBId, setTeamBId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [conditions, setConditions] = useState<string[]>([""]);
  const [handicapA, setHandicapA] = useState<string | null>(null);
  const [handicapB, setHandicapB] = useState<string | null>(null);
  const [showHandicap, setShowHandicap] = useState<boolean>(false);

  const [images, setImages] = useState<Player[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [chainsTokens, setChainsTokens] = useState<
    { chainId: string; tokenId: string }[]
  >([{ chainId: "", tokenId: "" }]);

  const getAllData = async () => {
    setIsLoading(true);
    try {
      const [imagesData, categoriesData, tokensData, chainsData] =
        await Promise.all([
          axios.get("/api/getallimages"),
          axios.get("/api/getallcategories"),
          axios.get("/api/getalltokens"),
          axios.get("/api/getallchains"),
        ]);

      setImages(imagesData.data);
      setCategories(categoriesData.data);
      setTokens(tokensData.data);
      setChains(chainsData.data);
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
    chainsTokens.forEach(async (item) => {
      const data = {
        code: eventName,
        saleEnd: saleEndTime,
        isFeatured: isFeatured,
        category: category,
        teamA: teamAId,
        teamB: teamBId,
        chainId: item.chainId,
        tokenAddress: item.tokenId,
        conditions:
          conditions.length === 1 && conditions[0] === "" ? null : conditions,
        handicapA: handicapA,
        handicapB: handicapB,
      };
      console.log("data: ", data);
      try {
        await axios.post("/api/saveevent", data);
        toast.success(`Event successfully created on ${item.chainId}!`);
        handleReset();
      } catch (error) {
        toast.error(`Event creating error`);
        console.log("Error in pusing event data to db: ", error);
      }
    });

    setIsLoading(false);
  };

  const handleReset = () => {
    setEventName("");
    setSaleEndTime("");
    setTeamAImage(null);
    setTeamBImage(null);
    setCategory("");
    setChainsTokens([{ chainId: "", tokenId: "" }]);
    setConditions([""]);
    setTeamAId(null);
    setTeamBId(null);
    setIsFeatured(false);
  };

  const handleConditionChange = (index: number, value: string) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = value;
    setConditions(updatedConditions);
  };
  const addConditionField = () => {
    setConditions([...conditions, ""]);
  };
  const removeConditionField = (index: number) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  const handleAddChainTokenRow = () => {
    setChainsTokens([...chainsTokens, { chainId: "", tokenId: "" }]);
  };

  const handleRemoveChainTokenRow = (index: number) => {
    setChainsTokens(chainsTokens.filter((_, i) => i !== index));
  };

  const handleChainChange = (index: number, chainId: string) => {
    const updated = [...chainsTokens];
    updated[index].chainId = chainId;
    setChainsTokens(updated);
  };

  const handleTokenChange = (index: number, tokenId: string) => {
    const updated = [...chainsTokens];
    updated[index].tokenId = tokenId;
    setChainsTokens(updated);
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
        <div className="mb-6">
          <label className="block font-medium mb-2">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">
            Sale End Time (Unix Timestamp)
          </label>
          <input
            type="number"
            value={saleEndTime}
            onChange={(e) => setSaleEndTime(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter a timestamp in seconds"
            required
          />
        </div>

        <div className="mt-4 mb-2">
          <label className="block font-medium mb-1">
            <input
              type="checkbox"
              name="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mr-2"
            />
            Is Featured
          </label>
        </div>
        <fieldset className="my-8 border border-gray-200 rounded-lg p-4">
          <label htmlFor="conditions" className="block font-medium mb-1">
            Conditions
          </label>
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={condition}
                onChange={(e) => handleConditionChange(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2"
                placeholder={`Condition ${index + 1}`}
              />
              <button
                type="button"
                onClick={addConditionField}
                className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 transition"
                title="Add Condition"
              >
                +
              </button>
              {conditions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeConditionField(index)}
                  className="bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition"
                  title="Remove Condition"
                >
                  -
                </button>
              )}
            </div>
          ))}
        </fieldset>

        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4 mt-4">
          <label className="block mb-4 font-medium">
            Category
            <Dropdown
              items={categories.map((cat) => ({
                id: cat.id,
                name: cat.category,
              }))}
              placeholder="Search and select a category"
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                setCategory(value.id);
                if (value.name === "Football") {
                  setShowHandicap(true);
                } else {
                  setShowHandicap(false);
                }
              }}
            />
          </label>
          {showHandicap && (
            <div className="flex flex-row justify-between">
              <div>
                <label htmlFor="handicapA" className="block font-medium mb-1">
                  Handicap Team A
                </label>
                <input
                  type="text"
                  id="handicapA"
                  name="handicapA"
                  value={handicapA ?? ""}
                  onChange={(e) => setHandicapA(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="handicapB" className="block font-medium mb-1">
                  Handicap Team B
                </label>
                <input
                  type="text"
                  id="handicapB"
                  name="handicapB"
                  value={handicapB ?? ""}
                  onChange={(e) => setHandicapB(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
          )}
        </fieldset>

        {/* Dynamic Chain-Token Section */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <legend className="text-lg font-medium text-gray-700 px-2">
            Chains and Tokens
          </legend>

          {chainsTokens.map((chainToken, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <Dropdown
                  items={chains.map((chain) => ({
                    id: chain.chainId,
                    name: chain.name,
                  }))}
                  placeholder="Select a chain"
                  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                  onChange={(value: any) => handleChainChange(index, value.id)}
                />
              </div>
              <div className="flex-1">
                <Dropdown
                  items={tokens.map((token) => ({
                    id: token.id,
                    name: token.symbol,
                  }))}
                  placeholder="Select a token"
                  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                  onChange={(value: any) => handleTokenChange(index, value.id)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveChainTokenRow(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                title="Remove Chain-Token Pair"
              >
                -
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddChainTokenRow}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Add Chain-Token
          </button>
        </fieldset>

        {/* Team ASection */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <label className="block mb-4 font-medium">
            Team A
            <Dropdown
              items={images}
              placeholder="Search and select an image"
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                setTeamAImage(
                  images.filter((image) => image.id.toString() == value.id)[0]
                    .url
                );
                setTeamAId(value.id);
              }}
            />
            {teamAImage && (
              <Image
                src={teamAImage}
                height={50}
                width={50}
                alt="Team B"
                className="w-24 h-24 mt-2 rounded-lg border border-gray-300"
              />
            )}
          </label>
        </fieldset>
        {/* Team B Section */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <label className="block mb-4 font-medium">
            Team B
            <Dropdown
              items={images}
              placeholder="Search and select an image"
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              onChange={(value: any) => {
                setTeamBImage(
                  images.filter((image) => image.id.toString() == value.id)[0]
                    .url
                );
                setTeamBId(value.id);
              }}
            />
            {teamBImage && (
              <Image
                src={teamBImage}
                alt="Team B"
                height={50}
                width={50}
                className="w-24 h-24 mt-2 rounded-lg border border-gray-300"
              />
            )}
          </label>
        </fieldset>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Create Event
        </button>
      </form>
    </>
  );
}
