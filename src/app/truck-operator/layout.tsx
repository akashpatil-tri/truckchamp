import SideBar from "@layout/dashboard/sidebar/page";

import OperatorNavbar from "@/components/layout/dashboard/navbar/operatorAdmin";

export default async function TruckOperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-wrapper">
      <section className="wrapper-main">
        <div className="wrapper-content"></div>
        <OperatorNavbar />
        <div className="content-wrapper-main">
          <SideBar userRole="truck_operator" />
          {children}
        </div>
      </section>
    </div>
  );
}
