"use client";

import React, { useState, useRef, useEffect } from "react";

import Image from "next/image";

import adminImage from "@assets/images/admin-img.png";
import headerLogo from "@assets/svg/header-logo.svg";
import notificationIcon from "@assets/svg/notification-icon.svg";
import { useAuth } from "@providers/AuthProvider";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import "./navbar.css";

export default function Navbar() {
  const { openOffcanvas } = useOffcanvasStore();
  const { logout, user } = useAuth();
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notificationRef = useRef<HTMLLIElement>(null);
  const userRef = useRef<HTMLLIElement>(null);

  const handleSidebarToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const root = document.querySelector(".page-wrapper");
    if (root) root.classList.toggle("sidebar-show-hide");
  };

  const handleOpenJobForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openOffcanvas("offcanvasStep1");
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav className="main-header fixed-top navbar navbar-expand">
      <div className="headera-logo-wrap sidebar-top-toggle">
        <a href="#" className="headera-logo">
          <Image src={headerLogo} alt="Image" />
        </a>
        <a href="#" className="headera-mlogo">
          <Image src={headerLogo} alt="Image" />
        </a>
        <a
          href="#"
          className="sidebar-icon sidebar-toggle sidebar-toggle-desk"
          onClick={handleSidebarToggle}
        >
          <i className="fa fa-angle-left" aria-hidden="true"></i>
        </a>
      </div>
      <div className="header-left-text">
        <div className="dash-txt dash-txt-desk">Dashboard</div>
      </div>
      <ul className="navbar-nav ms-auto main-header-right">
        <li
          className="ha-dropdown-main h-notification-main nav-item dropdown"
          ref={notificationRef}
        >
          <a
            className="ha-dropdown-click h-notification-click"
            href="#"
            role="button"
            aria-expanded={notificationDropdownOpen}
            onClick={(e) => {
              e.preventDefault();
              setNotificationDropdownOpen(!notificationDropdownOpen);
            }}
          >
            <Image src={notificationIcon} alt="#" />
          </a>
          <ul
            className={`dropdown-menu dropdown-menu-end notification-main ${
              notificationDropdownOpen ? "show" : ""
            }`}
          >
            <div className="notification-wrap">
              <div className="notification-head">
                <div className="notification-tl">Notifications</div>
                <div className="notification-rd">
                  <a href="#" className="notification-rd-link">
                    Mark all as read
                  </a>
                </div>
              </div>
              <div className="notification-view">
                <div className="notification-hereb">
                  <div className="notification-here-b-inner">
                    <a
                      href="#"
                      className="notification-here notification-here-njr"
                    >
                      <div className="notification-here-icon">
                        <img
                          src="../../assets/images/notification-njr-icon.png"
                          alt="Image"
                        />
                      </div>
                      <div className="notification-here-wrapt">
                        <div className="notification-here-tl">
                          New Job Request
                        </div>
                        <div className="notification-here-txt">
                          Your job request has been accepted by{" "}
                          <span className="notification-here-b">
                            Right Way Construction Pvt.
                          </span>{" "}
                          Review details and get ready to start.
                        </div>
                        <div className="notification-here-tm">2 m</div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="notification-hereb">
                  <div className="notification-here-b-inner">
                    <a href="#" className="notification-here">
                      <div className="notification-here-icon">
                        <img
                          src="../../assets/images/notification-jc-icon.png"
                          alt="Image"
                        />
                      </div>
                      <div className="notification-here-wrapt">
                        <div className="notification-here-tl">
                          Job Confirmed
                        </div>
                        <div className="notification-here-txt">
                          Your job request has been accepted, or you have been
                          assigned to a job. Check the details to proceed.
                        </div>
                        <div className="notification-here-tm">6 h</div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="notification-hereb">
                  <div className="notification-here-b-inner">
                    <a href="#" className="notification-here">
                      <div className="notification-here-icon">
                        <img
                          src="../../assets/images/notification-da-icon.png"
                          alt="Image"
                        />
                      </div>
                      <div className="notification-here-wrapt">
                        <div className="notification-here-tl">
                          Driver Assigned
                        </div>
                        <div className="notification-here-txt">
                          Driver John Doe has been assigned to job scheduled
                          start on 16 July, 2025 at 03:00 PM.
                        </div>
                        <div className="notification-here-tm">10 h</div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="notification-hereb">
                  <div className="notification-here-b-inner">
                    <a
                      href="#"
                      className="notification-here notification-here-des"
                    >
                      <div className="notification-here-icon">
                        <img
                          src="../../assets/images/notification-des-icon.png"
                          alt="Image"
                        />
                      </div>
                      <div className="notification-here-wrapt">
                        <div className="notification-here-tl">
                          Document Expire Soon
                        </div>
                        <div className="notification-here-txt">
                          Your vehicle insurance is nearing expiry. Renew soon
                          to stay compliant and protected.
                        </div>
                        <div className="notification-here-tm">1 h</div>
                      </div>
                    </a>
                    <div className="notification-here-btn">
                      <a href="#" className="btn notification-here-btn-link">
                        Renew Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="notification-all">
                <a href="#" className="notification-all-link">
                  View All Notifications
                </a>
              </div>
            </div>
          </ul>
        </li>
        <li>
          <button
            className="btn btn-primary me-2 btn offcanvas-btn offcanvas-desk"
            type="button"
            onClick={handleOpenJobForm}
          >
            Post a New Job
          </button>
        </li>

        <li
          className="ha-dropdown-main ad-dropdown-main nav-item dropdown"
          ref={userRef}
        >
          <a
            className="ha-dropdown-click dropdown-toggle"
            href="#"
            role="button"
            aria-expanded={userDropdownOpen}
            onClick={(e) => {
              e.preventDefault();
              setUserDropdownOpen(!userDropdownOpen);
            }}
          >
            <div className="user-menu">
              <Image src={adminImage} alt="#" />
              <div className="h-admin-info">
                <span>{user?.name || "User"}</span>
                <span>{user?.role || "Admin"}</span>
              </div>
            </div>
          </a>
          <ul
            className={`dropdown-menu dropdown-menu-end ${
              userDropdownOpen ? "show" : ""
            }`}
          >
            <li>
              <a className="dropdown-item" href="profile-settings.html">
                <span className="icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      d="M9 9C9.69223 9 10.3689 8.79473 10.9445 8.41015C11.5201 8.02556 11.9687 7.47894 12.2336 6.83939C12.4985 6.19985 12.5678 5.49612 12.4327 4.81719C12.2977 4.13825 11.9644 3.51461 11.4749 3.02513C10.9854 2.53564 10.3618 2.2023 9.68282 2.06725C9.00388 1.9322 8.30015 2.00152 7.66061 2.26642C7.02107 2.53133 6.47444 2.97993 6.08986 3.55551C5.70527 4.13108 5.5 4.80777 5.5 5.5C5.50093 6.42798 5.86997 7.31768 6.52615 7.97385C7.18233 8.63003 8.07203 8.99908 9 9ZM9 3.16667C9.46149 3.16667 9.91262 3.30352 10.2963 3.55991C10.68 3.8163 10.9791 4.18071 11.1557 4.60707C11.3323 5.03343 11.3785 5.50259 11.2885 5.95521C11.1985 6.40784 10.9762 6.8236 10.6499 7.14992C10.3236 7.47624 9.90783 7.69847 9.45521 7.7885C9.00259 7.87853 8.53343 7.83233 8.10707 7.65572C7.68071 7.47912 7.31629 7.18005 7.0599 6.79633C6.80351 6.41262 6.66667 5.96149 6.66667 5.5C6.66667 4.88116 6.9125 4.28767 7.35008 3.85009C7.78767 3.4125 8.38116 3.16667 9 3.16667Z"
                      fill="black"
                    />{" "}
                    <path
                      d="M9 10.1665C7.60809 10.168 6.27363 10.7217 5.28939 11.7059C4.30516 12.6901 3.75154 14.0246 3.75 15.4165C3.75 15.5712 3.81146 15.7196 3.92085 15.829C4.03025 15.9384 4.17862 15.9998 4.33333 15.9998C4.48804 15.9998 4.63642 15.9384 4.74581 15.829C4.85521 15.7196 4.91667 15.5712 4.91667 15.4165C4.91667 14.3335 5.34687 13.2949 6.11265 12.5292C6.87842 11.7634 7.91703 11.3332 9 11.3332C10.083 11.3332 11.1216 11.7634 11.8874 12.5292C12.6531 13.2949 13.0833 14.3335 13.0833 15.4165C13.0833 15.5712 13.1448 15.7196 13.2542 15.829C13.3636 15.9384 13.512 15.9998 13.6667 15.9998C13.8214 15.9998 13.9697 15.9384 14.0791 15.829C14.1885 15.7196 14.25 15.5712 14.25 15.4165C14.2485 14.0246 13.6948 12.6901 12.7106 11.7059C11.7264 10.7217 10.3919 10.168 9 10.1665Z"
                      fill="black"
                    />{" "}
                  </svg>
                </span>
                My Profile
              </a>
            </li>

            <li>
              <a className="dropdown-item" href="#">
                <span className="icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 7.3125C8.06802 7.3125 7.3125 8.06802 7.3125 9C7.3125 9.93198 8.06802 10.6875 9 10.6875C9.93198 10.6875 10.6875 9.93198 10.6875 9C10.6875 8.06802 9.93198 7.3125 9 7.3125ZM6.1875 9C6.1875 7.4467 7.4467 6.1875 9 6.1875C10.5533 6.1875 11.8125 7.4467 11.8125 9C11.8125 10.5533 10.5533 11.8125 9 11.8125C7.4467 11.8125 6.1875 10.5533 6.1875 9Z"
                      fill="black"
                    />{" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.20261 2.82773C7.00185 2.49327 6.57907 2.38922 6.2651 2.57602L6.25692 2.58088L4.95938 3.32331C4.54885 3.5579 4.40722 4.08976 4.64205 4.49619L4.155 4.7776L4.64166 4.49552C5.04296 5.18787 5.15084 5.94671 4.79237 6.56877C4.43394 7.19074 3.72359 7.4776 2.925 7.4776C2.45008 7.4776 2.0625 7.86883 2.0625 8.3401V9.6601C2.0625 10.1314 2.45008 10.5226 2.925 10.5226C3.72359 10.5226 4.43394 10.8095 4.79237 11.4314C5.1508 12.0534 5.04299 12.8121 4.64182 13.5044C4.40732 13.9108 4.54868 14.4422 4.95908 14.6767L6.26514 15.4241C6.5791 15.6109 7.00183 15.5069 7.20259 15.1725L7.2832 15.0333C7.68435 14.3412 8.28903 13.8695 9.00656 13.8695C9.72464 13.8695 10.3275 14.3415 10.725 15.0344C10.7251 15.0347 10.7253 15.035 10.7255 15.0354L10.8049 15.1725C11.0056 15.5069 11.4284 15.611 11.7424 15.4242L11.7506 15.4193L13.0481 14.6769C13.4576 14.4429 13.6014 13.9184 13.3648 13.5029C12.9644 12.8111 12.857 12.053 13.2151 11.4314C13.5736 10.8095 14.2839 10.5226 15.0825 10.5226C15.5574 10.5226 15.945 10.1314 15.945 9.6601V8.3401C15.945 7.86518 15.5538 7.4776 15.0825 7.4776C14.2839 7.4776 13.5736 7.19074 13.2151 6.56877C12.8567 5.94683 12.9645 5.18817 13.3656 4.49593C13.6002 4.08953 13.4589 3.55802 13.0484 3.32349L11.7424 2.57609C11.4284 2.38929 11.0056 2.49327 10.8049 2.82773L10.7243 2.96693C10.3231 3.65904 9.71847 4.13072 9.00094 4.13072C8.28293 4.13072 7.68016 3.65878 7.28266 2.966C7.28244 2.96562 7.28222 2.96523 7.282 2.96485L7.20261 2.82773ZM5.69436 1.60654C6.56394 1.09251 7.66693 1.40787 8.17092 2.255L8.17434 2.26075L8.2568 2.40327L8.258 2.40535C8.53551 2.88944 8.82497 3.00572 9.00094 3.00572C9.17775 3.00572 9.4694 2.88846 9.7507 2.40327C9.75075 2.40318 9.75065 2.40335 9.7507 2.40327L9.83655 2.25498C10.3405 1.40785 11.4436 1.09251 12.3132 1.60654L13.6066 2.34671C14.5611 2.89213 14.8847 4.11544 14.3395 5.05901L14.3392 5.05968C14.058 5.54483 14.1021 5.85474 14.1899 6.00706C14.2777 6.15946 14.5236 6.3526 15.0825 6.3526C16.1712 6.3526 17.07 7.24002 17.07 8.3401V9.6601C17.07 10.7488 16.1826 11.6476 15.0825 11.6476C14.5236 11.6476 14.2777 11.8407 14.1899 11.9931C14.1021 12.1455 14.058 12.4554 14.3392 12.9405L14.3409 12.9435C14.8833 13.8927 14.5618 15.1074 13.6069 15.6533C13.6068 15.6534 13.607 15.6533 13.6069 15.6533L12.3131 16.3937C11.4435 16.9077 10.3406 16.5923 9.83658 15.7452L9.83316 15.7395L9.7507 15.5969L9.7495 15.5948C9.47199 15.1108 9.18253 14.9945 9.00656 14.9945C8.82975 14.9945 8.5381 15.1117 8.2568 15.5969C8.25676 15.597 8.25685 15.5969 8.2568 15.5969L8.17095 15.7452C7.66698 16.5923 6.56399 16.9077 5.69443 16.3937L4.40092 15.6535C4.40082 15.6534 4.40102 15.6535 4.40092 15.6535C3.44669 15.108 3.12284 13.8847 3.66795 12.9412L3.66834 12.9405C3.94954 12.4554 3.90541 12.1455 3.81763 11.9931C3.72981 11.8407 3.48391 11.6476 2.925 11.6476C1.82492 11.6476 0.9375 10.7488 0.9375 9.6601V8.3401C0.9375 7.25137 1.82492 6.3526 2.925 6.3526C3.48391 6.3526 3.72981 6.15946 3.81763 6.00706C3.90541 5.85474 3.94954 5.54483 3.66834 5.05968L3.66795 5.05901C3.12284 4.11554 3.44638 2.89238 4.40062 2.34689L5.69436 1.60654Z"
                      fill="black"
                    />{" "}
                  </svg>
                </span>
                Settings
              </a>
            </li>

            <li>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                <span className="icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      d="M6.75096 14.0625H4.16853C4.0416 14.0622 3.93877 13.9594 3.93848 13.8324V4.16755C3.93879 4.04062 4.0416 3.93779 4.16853 3.9375H6.75096C7.21695 3.9375 7.59471 3.55974 7.59471 3.09375C7.59471 2.62776 7.21695 2.25 6.75096 2.25H4.16853C3.10999 2.25124 2.25222 3.10904 2.25098 4.16755V13.8324C2.25222 14.891 3.10999 15.7488 4.16853 15.75H6.75096C7.21695 15.75 7.59471 15.3722 7.59471 14.9062C7.59471 14.4403 7.21695 14.0625 6.75096 14.0625Z"
                      fill="black"
                    />{" "}
                    <path
                      d="M15.058 7.72381L12.987 6.17179C12.6744 5.93745 12.1677 5.93754 11.8552 6.172C11.5428 6.40646 11.5429 6.78649 11.8555 7.02083L13.6757 8.3856L6.42522 8.3968C5.98327 8.3968 5.625 8.6655 5.625 8.99696C5.625 9.32842 5.98327 9.59713 6.42522 9.59713L13.7051 9.58713L11.8555 10.9743C11.5544 11.2169 11.5725 11.5967 11.8959 11.8225C12.2034 12.0372 12.6798 12.037 12.987 11.8221L15.0564 10.2701C15.9939 9.56699 15.9939 8.42698 15.0564 7.72385L15.0564 7.72383L15.058 7.72381Z"
                      fill="black"
                    />{" "}
                  </svg>
                </span>
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
