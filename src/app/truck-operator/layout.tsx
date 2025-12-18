import OperatorNavbar from "@/components/layout/dashboard/navbar/operatorAdmin";
import Navbar from "@layout/dashboard/navbar/page";
import SideBar from "@layout/dashboard/sidebar/page";
import { headers } from "next/headers";

export default async function TruckOperatorLayout({
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
        <OperatorNavbar />
        <div className="content-wrapper-main">
          <SideBar userRole="truck_operator" pathname={pathname} />
          {children}
        </div>
      </section>
    </div>
  );
}
