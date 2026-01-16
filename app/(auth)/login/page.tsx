import Login from "@/components/Login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | EduTIA",
  description: "Login to your EduTIA account",
};

export default function Page() {
  return <Login />;
}
