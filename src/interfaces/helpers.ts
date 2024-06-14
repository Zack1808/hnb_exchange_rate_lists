import React from "react";

export interface ScrollIntoViewProps {
  target: React.RefObject<HTMLDivElement>;
}

export interface ChangeDateByDaysProps {
  date: string;
  daysAmount: number;
}

export interface SortProps {
  data: Record<string, any>[];
  key: keyof Record<string, any>;
  direction: "asc" | "desc";
  isNumber: boolean;
}
