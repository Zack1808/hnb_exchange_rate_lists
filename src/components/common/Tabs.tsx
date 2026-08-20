import React from "react";

import Button from "./Button";

interface TabView {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  tabs: TabView[];
}

const Tabs: React.FC<TabsProps> = ({ value, onChange, tabs }) => {
  const activeTab = tabs.find((tab) => tab.value === value);

  return (
    <>
      <div className="flex mb-6 bg-gray-100 rounded-sm">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant="none"
            className={`${tab.value === value ? "bg-white text-red-600" : "text-gray-600"} px-10! py-4! cursor-pointer`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      {activeTab?.content}
    </>
  );
};

export default Tabs;
