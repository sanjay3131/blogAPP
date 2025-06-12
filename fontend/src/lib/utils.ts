import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { ClassValue } from "clsx"; // You can optionally skip this if you face TypeScript issues

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
