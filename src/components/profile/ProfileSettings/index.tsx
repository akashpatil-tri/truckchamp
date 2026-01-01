"use client";

import { useState } from "react";

import MyProfile from "../MyProfile";
import TermsConditions from "../TermsConditions";
import PrivacyPolicy from "../PrivacyPolicy";
import ContactUs from "../ContactUs";
import DeleteAccount from "../DeleteAccount";
import LogoutModal from "../LogoutModal";

import "./ProfileSettings.css";

type TabType =
  | "my-profile"
  | "terms"
  | "privacy"
  | "contact"
  | "delete"
  | "logout";

const navItems: { id: TabType; label: string }[] = [
  { id: "my-profile", label: "My Profile" },
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "contact", label: "Contact Us" },
  { id: "delete", label: "Delete Account" },
  { id: "logout", label: "Log Out" },
];

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<TabType>("my-profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleTabClick = (tabId: TabType) => {
    if (tabId === "logout") {
      setShowLogoutModal(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "my-profile":
        return <MyProfile />;
      case "terms":
        return <TermsConditions />;
      case "privacy":
        return <PrivacyPolicy />;
      case "contact":
        return <ContactUs />;
      case "delete":
        return <DeleteAccount />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content">
        <h2 className="fs-18 fw-bold mb-4">Profile Settings</h2>
        <div className="profile-settings-container">
          <div className="profile-sidebar">
            <nav className="profile-sidebar-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`profile-nav-item ${
                    activeTab === item.id ||
                    (item.id === "logout" && showLogoutModal)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleTabClick(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="profile-content">{renderContent()}</div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
