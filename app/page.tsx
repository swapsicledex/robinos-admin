"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "react-toastify/dist/ReactToastify.css";
import ViewImagesTab from "@/components/ViewImagesTab";
import UploadImageTab from "@/components/UploadImageTab";

function Home() {
  const [currentTab, setCurrentTab] = useState("upload");
  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen p-10 flex flex-col items-center">
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full max-w-4xl"
      >
        <TabsList className="flex space-x-4 bg-white p-4 rounded-lg shadow mb-8">
          <TabsTrigger
            value="upload"
            className="flex-1 text-center p-2 bg-gray-100 rounded-md"
          >
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="flex-1 text-center p-2 bg-gray-100 rounded-md"
          >
            View
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="upload"
          className="p-6 bg-white rounded-lg shadow-md w-full flex flex-col gap-4"
        >
          <UploadImageTab editMode={false} editId={-1} editName="" editUrl="" />
        </TabsContent>

        <TabsContent
          value="other"
          className="p-6 bg-white rounded-lg shadow-md w-full pt-0"
        >
          <ViewImagesTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default Home;
