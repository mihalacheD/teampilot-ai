"use client";

import { AISummaryCard } from "@/components/assistant/AISummaryCard";


const AssistantPage = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">AI Assistant</h1>
        </div>
      <AISummaryCard/>
    </>
  );
};

export default AssistantPage;
