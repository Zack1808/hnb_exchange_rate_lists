import React from "react";

import Button from "./Button";

interface TabView {
  value: string;
  label: string;
  link?: string;
  content: React.ReactNode;
}

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  actionButton?: React.ReactNode;
  tabs: TabView[];
}

const Tabs: React.FC<TabsProps> = ({ value, onChange, actionButton, tabs }) => {
  const activeTab = tabs.find((tab) => tab.value === value);

  return (
    <>
      <div className="flex md:flex-row flex-col gap-3 md:items-center items-stretch justify-between w-full mb-6 rounded-sm">
        <div className="flex rounded-sm bg-gray-100 flex-wrap">
          {tabs.map((tab) =>
            tab.link ? (
              <Button
                key={tab.value}
                to={tab.link}
                variant="none"
                className={`${tab.value === value ? "bg-white text-red-600" : "text-gray-600"} px-10! py-4! cursor-pointer md:max-w-fit max-w-none justify-center w-full`}
                onClick={() => onChange(tab.value)}
              >
                {tab.label}
              </Button>
            ) : (
              <Button
                key={tab.value}
                variant="none"
                className={`${tab.value === value ? "bg-white text-red-600" : "text-gray-600"} px-10! py-4! cursor-pointer md:max-w-fit max-w-none justify-center w-full`}
                onClick={() => onChange(tab.value)}
              >
                {tab.label}
              </Button>
            ),
          )}
        </div>
        {actionButton && actionButton}
      </div>
      {activeTab?.content}
    </>
  );
};

export default Tabs;
