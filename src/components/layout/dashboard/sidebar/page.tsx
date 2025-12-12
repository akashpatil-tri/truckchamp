import Image from "next/image";
import Link from "next/link";

import billingIcon from "@assets/svg/billing-icon.svg";
import dashboardIcon from "@assets/svg/dashboard-icon.svg";
import jobManagementIcon from "@assets/svg/job-management-icon.svg";
import ratingIcon from "@assets/svg/rating-icon.svg";
import teamManagementIcon from "@assets/svg/team-management-icon.svg";

export default function SideBar() {
  return (
    <>
      <aside className="main-sidebar">
        <div className="sidebar sidebar-menu-main">
          <nav className="sidebar-menu ">
            <ul className="nav-sidebar flex-column">
              <li className="sb-nav-item active">
                <Link href="/dashboard" className="sb-nav-link">
                  <Image
                    className="sb-nav-icon"
                    src={dashboardIcon}
                    alt="icon"
                  />
                  <p>Dashboard</p>
                </Link>
              </li>
              <li className="sb-nav-item">
                <a href="job-management-full.html" className="sb-nav-link">
                  <Image
                    className="sb-nav-icon"
                    src={jobManagementIcon}
                    alt="icon"
                  />
                  <p>Job Management</p>
                </a>
              </li>
              <li className="sb-nav-item">
                <a href="team-members.html" className="sb-nav-link">
                  <Image
                    className="sb-nav-icon"
                    src={teamManagementIcon}
                    alt="icon"
                  />
                  <p>Team Management</p>
                </a>
              </li>
              <li className="sb-nav-item">
                <a href="#" className="sb-nav-link">
                  <Image className="sb-nav-icon" src={billingIcon} alt="icon" />
                  <p>Billing & Invoicing</p>
                </a>
              </li>
              <li className="sb-nav-item">
                <a href="#" className="sb-nav-link">
                  <Image className="sb-nav-icon" src={ratingIcon} alt="icon" />
                  <p>Rating & Reviews</p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
