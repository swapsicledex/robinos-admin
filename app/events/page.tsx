"use client";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Navbar from "@/components/ui/Navbar";
import EventCreate from "./EventCreate";
import EventView from "./EventView";

const EventsPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6">Events Management</h1>
        <Tabs>
          <TabList>
            <Tab>Create Event</Tab>
            <Tab>Manage Events</Tab>
          </TabList>

          <TabPanel>
            <EventCreate />
          </TabPanel>

          <TabPanel>
            <EventView />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default EventsPage;
