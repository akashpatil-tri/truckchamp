import Navbar from "@/components/layout/dashboard/navbar/page";
import SideBar from "@/components/layout/dashboard/sidebar/page";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - TruckMatch",
  description: "Login to manage your fleet and jobs efficiently",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-wrapper">
      <section className="wrapper-main">
        <div className="wrapper-content"></div>
        <Navbar />
        <div className="content-wrapper-main">
          <SideBar />
          {children}
        </div>
      </section>
    </div>
  );
}
