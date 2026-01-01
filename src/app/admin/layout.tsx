import Navbar from "@layout/dashboard/navbar/page";
import SideBar from "@layout/dashboard/sidebar/page";

export default async function AdminLayout({
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
          <SideBar userRole="super_admin" />
          {children}
        </div>
      </section>
    </div>
  );
}
