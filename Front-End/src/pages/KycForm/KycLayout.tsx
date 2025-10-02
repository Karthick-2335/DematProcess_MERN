import React, { useEffect, useState, useMemo } from "react";
import Profile from "./Profile";
import Register from "./Register";

interface stageInfo {
  stageId: number;
  stageName: string;
  hasDone: boolean;
}

const KycLayout = () => {
  const stages: stageInfo[] = [
    { stageId: 1, stageName: "Registration", hasDone: false },
    { stageId: 2, stageName: "Address", hasDone: false },
    { stageId: 3, stageName: "Nominee", hasDone: false },
    { stageId: 4, stageName: "Profile", hasDone: false },
    { stageId: 5, stageName: "Bank", hasDone: false },
    { stageId: 6, stageName: "Product", hasDone: false },
    { stageId: 7, stageName: "Document", hasDone: false },
    { stageId: 8, stageName: "Preview", hasDone: false },
  ];

  const [activeTab, setActiveTab] = useState<number>(stages[0].stageId);
  const [stageChange, setStage] = useState<stageInfo[]>(stages);

  const btnPrevious = () => setActiveTab(activeTab - 1);

  const btnNext = () => {
    setStage(
      stageChange.map((x) =>
        x.stageId === activeTab ? { ...x, hasDone: true } : x
      )
    );
    setActiveTab(activeTab + 1);
  };

  return (
    <div className="w-full mx-auto">
      {/* Tabs */}
      <div className="overflow-x-auto border-b border-gray-200">
        <div className="flex min-w-max">
          {stageChange.map((stage) => (
            <button
              key={stage.stageId}
              onClick={() => setActiveTab(stage.stageId)}
              className={`flex-1 py-2 px-3 text-center text-sm sm:text-base font-medium whitespace-nowrap transition-colors duration-200
                ${
                  activeTab === stage.stageId && !stage.hasDone
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : activeTab === stage.stageId && stage.hasDone
                    ? "border-b-2 border-green-600 text-green-600"
                    : stage.hasDone
                    ? "border-b-2 border-green-600 hover:text-green-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
            >
              {stage.stageName}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="sm:p-4 shadow rounded-b-lg">
        {activeTab === 1 && (
          <Register
            btnNext={btnNext}
            btnPrevious={btnPrevious}
            activeTab={activeTab}
          />
        )}
        {activeTab === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Address</h2>
            <p className="text-gray-600">This is the address info area.</p>
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Nominee</h2>
            <p className="text-gray-600">This is the nominee info area.</p>
          </div>
        )}
        {activeTab === 4 && (
          <Profile
            btnNext={btnNext}
            btnPrevious={btnPrevious}
            activeTab={activeTab}
          />
        )}
        {activeTab === 5 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Bank</h2>
            <p className="text-gray-600">This is the bank info area.</p>
          </div>
        )}
        {activeTab === 6 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Product</h2>
            <p className="text-gray-600">This is the product info area.</p>
          </div>
        )}
        {activeTab === 7 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Document</h2>
            <p className="text-gray-600">This is the document info area.</p>
          </div>
        )}
        {activeTab === 8 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Preview</h2>
            <p className="text-gray-600">This is the preview info area.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycLayout;
