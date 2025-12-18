import { headers } from "next/headers";

import Navbar from "@layout/dashboard/navbar/page";
import SideBar from "@layout/dashboard/sidebar/page";

export default async function ConstructionAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  return (
    <div className="page-wrapper">
      <section className="wrapper-main">
        <div className="wrapper-content"></div>
        <Navbar />
        <div className="content-wrapper-main">
          <SideBar userRole={"construction_admin"} pathname={pathname} />
          {children}
        </div>
      </section>
    </div>
  );
}
