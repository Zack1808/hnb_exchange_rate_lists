import React from "react";
import { ExchangeRateItems } from "./state";

export interface HeroContainerProps {
  children: React.ReactNode;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  secondary?: boolean;
}

export interface ContainerProps {
  children: React.ReactNode;
  background?: boolean;
  spacing: "big" | "small" | "medium" | "none";
}

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (date: string) => void;
  value?: string;
  min?: string;
  max?: string;
}

export interface TableProps {
  headers: { title: string; value: string }[];
  data: ExchangeRateItems[];
  colorRow?: (index: number) => string;
  sortable?: boolean;
  filterable?: boolean;
  filterableKeys?: string[];
  linkCols?: string[];
}
