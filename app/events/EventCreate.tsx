"use client";

import { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import Dropdown, { DropdownItem } from "@/components/dashboard/ui/Dropdown";
import { toast } from "react-toastify";
import Image from "next/image";
import DateTimePicker from "@/components/dashboard/ui/DateTimePicker";

export default function EventCreate() {
  const [eventName, setEventName] = useState("");
  const [saleEndTime, setSaleEndTime] = useState(
    Math.floor(Date.now() / 1000).toString()
  );
  const [saleStartTime, setSaleStartTime] = useState(
    Math.floor(Date.now() / 1000).toString()
  );
  const [teamAImage, setTeamAImage] = useState<string | null>(null);
  const [teamBImage, setTeamBImage] = useState<string | null>(null);
  const [teamAId, setTeamAId] = useState<string | null>(null);
  const [teamBId, setTeamBId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [tournament, setTournament] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [conditions, setConditions] = useState<string[]>([""]);
  const [handicapA, setHandicapA] = useState<string | null>(null);
  const [handicapB, setHandicapB] = useState<string | null>(null);
  const [showHandicap, setShowHandicap] = useState<boolean>(false);

  // const [images, setImages] = useState<Player[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  // const [tokens, setTokens] = useState<Token[]>([]);
  // const [chains, setChains] = useState<Chain[]>([]);
  // const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [selectedCategoryItem, setSelectedCategoryItem] =
    useState<DropdownItem | null>(null);
  const [selectedTournamentItem, setSelectedTournamentItem] =
    useState<DropdownItem | null>(null);
  const [selectedTeamAItem, setSelectedTeamAItem] =
    useState<DropdownItem | null>(null);
  const [selectedTeamBItem, setSelectedTeamBItem] =
    useState<DropdownItem | null>(null);
  const [booleanAItem, setBooleanAItem] = useState<DropdownItem | null>(null);
  const [booleanBItem, setBooleanBItem] = useState<DropdownItem | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [chainsTokens, setChainsTokens] = useState<
    {
      chainId: string;
      tokenId: string;
      selectedChainItem: DropdownItem | null;
      selectedTokenItem: DropdownItem | null;
    }[]
  >([
    {
      chainId: "",
      tokenId: "",
      selectedChainItem: null,
      selectedTokenItem: null,
    },
  ]);

  // const getAllData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const [
  //       imagesData,
  //       categoriesData,
  //       tokensData,
  //       chainsData,
  //       tournamentsData,
  //     ] = await Promise.all([
  //       axios.get("/api/getallimages"),
  //       axios.get("/api/getallcategories"),
  //       axios.get("/api/getalltokens"),
  //       axios.get("/api/getallchains"),
  //       axios.get("/api/getalltournaments"),
  //     ]);

  //     setImages(imagesData.data);
  //     setCategories(categoriesData.data);
  //     setTokens(tokensData.data);
  //     setChains(chainsData.data);
  //     setTournaments(tournamentsData.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => { }, [chainsTokens, category]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    chainsTokens.forEach(async (item) => {
      const data = {
        code: eventName,
        saleEnd: saleEndTime,
        saleStart: saleStartTime,
        isFeatured,
        category,
        teamA: teamAId,
        teamB: teamBId,
        chainId: item.chainId,
        tokenAddress: item.tokenId,
        conditions:
          conditions.length === 1 && conditions[0] === "" ? null : conditions,
        handicapA,
        handicapB,
        tournament,
        booleanA: booleanAItem ? booleanAItem.label : null,
        booleanB: booleanBItem ? booleanBItem.label : null,
      };
      try {
        await axios.post("/api/saveevent", data);
        toast.success(`Event successfully created on ${item.chainId}!`);
        await handleReset();
      } catch (error) {
        toast.error(`Event creating error`);
        console.log("Error in pusing event data to db: ", error);
      }
    });

    setIsLoading(false);
  };

  const handleReset = async () => {
    setEventName("");
    setSaleEndTime(Math.floor(Date.now() / 1000).toString());
    setSaleStartTime(Math.floor(Date.now() / 1000).toString());
    setTeamAImage(null);
    setTeamBImage(null);
    setCategory("");
    setChainsTokens([
      {
        chainId: "",
        tokenId: "",
        selectedChainItem: null,
        selectedTokenItem: null,
      },
    ]);
    setConditions([""]);
    setTeamAId(null);
    setTeamBId(null);
    setIsFeatured(false);
    setTournament(null);
    setSelectedCategoryItem(null);
    setSelectedTournamentItem(null);
    setSelectedTeamAItem(null);
    setSelectedTeamBItem(null);
    setBooleanAItem(null);
    setBooleanBItem(null);
    setHandicapA("");
    setHandicapB("");
    setShowHandicap(false);
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
    setChainsTokens([
      ...chainsTokens,
      {
        chainId: "",
        tokenId: "",
        selectedChainItem: null,
        selectedTokenItem: null,
      },
    ]);
  };

  const handleRemoveChainTokenRow = (index: number) => {
    setChainsTokens(chainsTokens.filter((_, i) => i !== index));
  };

  const handleChainChange = (
    index: number,
    chainId: string,
    option: DropdownItem
  ) => {
    const updated = [...chainsTokens];
    updated[index].chainId = chainId;
    updated[index].selectedChainItem = option;
    updated[index].tokenId = "";
    updated[index].selectedTokenItem = null;
    setChainsTokens(updated);
  };

  const handleTokenChange = (
    index: number,
    tokenId: string,
    option: DropdownItem
  ) => {
    const updated = [...chainsTokens];
    updated[index].tokenId = tokenId;
    updated[index].selectedTokenItem = option;
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
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4 mt-4">
          <label className="block font-medium mb-2">
            Sale Start Time (Unix Timestamp)
          </label>
          <DateTimePicker
            timestamp={saleStartTime}
            setTimestamp={setSaleStartTime}
          />
        </fieldset>

        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4 mt-4">
          <label className="block font-medium mb-2">
            Sale End Time (Unix Timestamp)
          </label>
          <DateTimePicker
            timestamp={saleEndTime}
            setTimestamp={setSaleEndTime}
          />
        </fieldset>

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

        {/* Dynamic Chain-Token Section */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <legend className="text-lg font-medium text-gray-700 px-2">
            Chains and Tokens
          </legend>

          {chainsTokens.map((chainToken, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <Dropdown
                  apiEndpoint="/api/getallchains?"
                  value={chainToken.selectedChainItem}
                  placeholder="Select a chain"
                  valueKey="chainId"
                  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                  onChange={(option: any) => {
                    setChainsTokens([
                      ...chainsTokens,
                      { ...chainToken, selectedChainItem: option },
                    ]);
                    handleChainChange(index, option?.value, option);
                  }}
                />
              </div>
              {chainToken.chainId ? (
                <div className="flex-1">
                  <Dropdown
                    apiEndpoint={`/api/getalltokens?chainId=${chainToken.chainId}`}
                    value={chainToken.selectedTokenItem}
                    placeholder="Select a token"
                    labelKey="symbol"
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    onChange={(option: any) => {
                      handleTokenChange(index, option?.value, option);
                    }}
                  />
                </div>
              ) : null}
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

        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4 mt-4">
          <label className="block mb-4 font-medium">
            Category
            <Dropdown
              apiEndpoint="/api/getallcategories?"
              placeholder="Search and select a category"
              value={selectedCategoryItem}
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              onChange={(option: any) => {
                setTournament(null);
                setSelectedTournamentItem(null);
                setSelectedCategoryItem(option);
                setCategory(option?.value.toString());
                if (option?.label === "Football") {
                  setShowHandicap(true);
                } else {
                  setShowHandicap(false);
                }
              }}
            />
          </label>

          <label className="block mb-4 font-medium">
            Tournament
            <Dropdown
              apiEndpoint={`/api/getalltournaments?categoryId=${Number(
                category
              )}`}
              value={selectedTournamentItem}
              placeholder="Search and select a tournament"
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              onChange={(option: any) => {
                setSelectedTournamentItem(option);
                setTournament(option?.value);
              }}
            />
          </label>
        </fieldset>

        {/* Team ASection */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <label className="block mb-4 font-medium">
            Team A
            <Dropdown
              apiEndpoint={`/api/getallimages?categoryId=${category}&tournamentId=${tournament}`}
              value={selectedTeamAItem}
              placeholder="Search and select an image"
              extraPropKey="url"
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              onChange={(option: any) => {
                setSelectedTeamAItem(option);
                setTeamAImage(option?.extraProp);
                setTeamAId(option?.value);
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
            </div>
          )}
        </fieldset>
        {/* Team B Section */}
        <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
          <label className="block mb-4 font-medium">
            Team B
            <Dropdown
              apiEndpoint={`/api/getallimages?categoryId=${category}&tournamentId=${tournament}`}
              value={selectedTeamBItem}
              placeholder="Search and select an image"
              extraPropKey="url"
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              onChange={(option: any) => {
                setSelectedTeamBItem(option);
                setTeamBImage(option?.extraProp);
                setTeamBId(option?.value);
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
          {showHandicap && (
            <div className="flex flex-row justify-between">
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

        <button
          type="submit"
          className={`mt-4 py-2 px-4 rounded-lg w-full ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          disabled={isLoading}
        >
          Create Event
        </button>
      </form>
    </>
  );
}
