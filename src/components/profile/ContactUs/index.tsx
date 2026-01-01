"use client";

import Spinner from "@common/Spinner";
import { useProfileQuery } from "@/queries/profile";

export default function ContactUs() {
  const { data: profile, isLoading } = useProfileQuery();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="profile-content-header">
        <h3 className="profile-content-title">Contact Details</h3>
      </div>

      <div className="contact-details-grid">
        <div className="contact-detail-item">
          <div className="contact-detail-label">Primary Contact Name</div>
          <div className="contact-detail-value">
            {profile?.primaryContactName || "-"}
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-label">Primary Contact Email</div>
          <div className="contact-detail-value">
            {profile?.primaryContactEmail || "-"}
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-label">Mobile Number</div>
          <div className="contact-detail-value">
            {profile?.mobileNumber || "-"}
          </div>
        </div>
        <div className="contact-detail-item">
          <div className="contact-detail-label">
            ABN / Business Registration Number
          </div>
          <div className="contact-detail-value">
            {profile?.abnNumber || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
