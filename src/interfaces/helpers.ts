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
  key: string;
  direction: "asc" | "desc";
  isNumber: boolean;
}
