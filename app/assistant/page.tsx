"use client";

import { AISummaryCard } from "@/components/assistant/AISummaryCard";


const AssistantPage = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">AI Assistant</h1>
        <p className="text-gray-600">
          * To save API costs, this summary is cached. Click regenerate to see live AI analysis.
        </p>
      </div>
      <AISummaryCard />
    </>
  );
};

export default AssistantPage;
