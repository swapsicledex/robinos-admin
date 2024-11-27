"use client";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-toastify/dist/ReactToastify.css";
import "react-tabs/style/react-tabs.css";

import ViewImagesTab from "@/app/players/ViewImagesTab";
import UploadImageTab from "@/app/players/UploadImageTab";
import Navbar from "@/components/dashboard/ui/Navbar";

function Players() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6">Players/Teams</h1>
        <Tabs>
          <TabList>
            <Tab>Upload</Tab>
            <Tab>View</Tab>
          </TabList>

          <TabPanel>
            <UploadImageTab
              editMode={false}
              editItem={null}
              uploadHandler={() => null}
            />
          </TabPanel>

          <TabPanel>
            <ViewImagesTab />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}

export default Players;
