"use client";
import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Navbar from "@/components/ui/Navbar";
import CategoryCreate from "./CategoryCreate";
import CategoryView from "./CategoryView";

export type Category = {
  id: number;
  category: string;
};

export default function Category() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6">Categories Management</h1>
        <Tabs>
          <TabList>
            <Tab>Add Category</Tab>
            <Tab>Manage Categories</Tab>
          </TabList>

          <TabPanel>
            <CategoryCreate />
          </TabPanel>

          <TabPanel>
            <CategoryView />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
