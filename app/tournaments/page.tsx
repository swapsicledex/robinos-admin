"use client";
import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Navbar from "@/components/dashboard/ui/Navbar";
import TournamentCreate from "./TournamentCreate";
import TournamentView from "./TournamentView";

export type Category = {
  id: number;
  category: string;
};

export default function Category() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6">Tournaments Management</h1>
        <Tabs>
          <TabList>
            <Tab>Add Tournament</Tab>
            <Tab>Manage Tournaments</Tab>
          </TabList>

          <TabPanel>
            <TournamentCreate/>
          </TabPanel>

          <TabPanel>
            <TournamentView />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
