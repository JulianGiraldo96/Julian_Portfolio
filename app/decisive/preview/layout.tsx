import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decisive | Julian Giraldo",
  description:
    "A local first decision matrix with a deadline calendar. Four consequence quadrants, drag to reschedule, and nothing leaves your browser.",
};

export default function DecisiveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
