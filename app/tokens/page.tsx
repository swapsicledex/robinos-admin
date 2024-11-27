"use client"
import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Navbar from "@/components/dashboard/ui/Navbar";
import TokenAdd from "./TokenAdd";
import TokenView from "./TokenView";

export type Token = {
  id: number;
  name: string;
  symbol: string;
  address: string;
  chainId: number;
};
export default function Tokens() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Tokens Management</h1>
      <Tabs>
        <TabList>
          <Tab>Add Token</Tab>
          <Tab>Manage Tokens</Tab>
        </TabList>

        <TabPanel>
          <TokenAdd />
        </TabPanel>

        <TabPanel>
          <TokenView />
        </TabPanel>
      </Tabs>
    </div>
  </>
  );
}
