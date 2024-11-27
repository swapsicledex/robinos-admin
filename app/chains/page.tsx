"use client";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Navbar from "@/components/dashboard/ui/Navbar";
import ChainAdd from "./ChainAdd";
import ChainsView from "./ChainsView";

const EventsPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6">Events Management</h1>
        <Tabs>
          <TabList>
            <Tab>Add Chain</Tab>
            <Tab>Manage Chains</Tab>
          </TabList>

          <TabPanel>
            <ChainAdd />
          </TabPanel>

          <TabPanel>
            <ChainsView />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default EventsPage;
