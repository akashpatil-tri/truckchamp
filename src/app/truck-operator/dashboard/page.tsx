"use client";

import Image from "next/image";

import jobIcon from "@assets/svg/d-job-icon.svg";
import memIcon from "@assets/svg/d-mem-icon.svg";
import DriverForm from "@forms/DriverForm";
import FleetForm from "@forms/FleetForm";
import TeamMemberForm from "@forms/TeamMemberForm";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

export default function Dashboard() {
  const { openOffcanvas } = useOffcanvasStore();

  const handleOpenTeamMemberForm = () => {
    openOffcanvas("offcanvasAddTeamMember");
  };

  const handleOpenFleetForm = () => {
    openOffcanvas("offcanvasAddFleet");
  };

  const handleOpenDriverForm = () => {
    openOffcanvas("offcanvasAddDriver");
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content">
          <div className="row gx-2 gx-xl-3">
            {/* Total Jobs */}
            <div className="col-md-6 col-lg-6 col-xl-3 mb-3">
              <div className="box-count-main">
                <div className="box-count-wrap border2-gray bg-white br14">
                  <div className="box-count-top">
                    <div className="box-count-top-wrap borderb-gray">
                      <div className="box-count-icon">
                        <Image
                          className="box-count-icon-img"
                          src={jobIcon}
                          alt="Total Jobs"
                        />
                      </div>
                      <div className="box-count-txt-wrap ps-2">
                        <div className="box-count-head">00</div>
                        <div className="box-count-shead">Total Jobs</div>
                      </div>
                    </div>
                  </div>
                  <div className="box-count-bottom">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      role="button"
                    >
                      No Job Yet
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Team Members */}
            <div className="col-md-6 col-lg-6 col-xl-3 mb-3">
              <div className="box-count-main">
                <div className="box-count-wrap border2-gray bg-white br14">
                  <div className="box-count-top">
                    <div className="box-count-top-wrap borderb-gray">
                      <div className="box-count-icon">
                        <Image
                          className="box-count-icon-img"
                          src={memIcon}
                          alt="Total Team Members"
                        />
                      </div>
                      <div className="box-count-txt-wrap ps-2">
                        <div className="box-count-head">00</div>
                        <div className="box-count-shead">Total Team Members</div>
                      </div>
                    </div>
                  </div>
                  <div className="box-count-bottom">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenTeamMemberForm();
                      }}
                      role="button"
                    >
                      + Add Team Members
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Fleet */}
            <div className="col-md-6 col-lg-6 col-xl-3 mb-3">
              <div className="box-count-main">
                <div className="box-count-wrap border2-gray bg-white br14">
                  <div className="box-count-top">
                    <div className="box-count-top-wrap borderb-gray">
                      <div className="box-count-icon">
                        <Image
                          className="box-count-icon-img"
                          src={jobIcon}
                          alt="Total Fleet"
                        />
                      </div>
                      <div className="box-count-txt-wrap ps-2">
                        <div className="box-count-head">00</div>
                        <div className="box-count-shead">Total Fleet</div>
                      </div>
                    </div>
                  </div>
                  <div className="box-count-bottom">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenFleetForm();
                      }}
                      role="button"
                    >
                      + Add Fleet
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Driver */}
            <div className="col-md-6 col-lg-6 col-xl-3 mb-3">
              <div className="box-count-main">
                <div className="box-count-wrap border2-gray bg-white br14">
                  <div className="box-count-top">
                    <div className="box-count-top-wrap borderb-gray">
                      <div className="box-count-icon">
                        <Image
                          className="box-count-icon-img"
                          src={memIcon}
                          alt="Total Driver"
                        />
                      </div>
                      <div className="box-count-txt-wrap ps-2">
                        <div className="box-count-head">00</div>
                        <div className="box-count-shead">Total Driver</div>
                      </div>
                    </div>
                  </div>
                  <div className="box-count-bottom">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenDriverForm();
                      }}
                      role="button"
                    >
                      + Add Driver
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="row gx-2 gx-xl-3">
            {/* New Bookings */}
            <div className="col-12 col-md-7 col-lg-7 col-xl-8 mb-3 mb-md-0">
              <div className="job-card-main">
                <div className="job-card-wrap border2-gray bg-white br14">
                  <div className="job-card-title borderb2-gray">
                    <div className="job-card-title-t">New Bookings</div>
                  </div>
                  <div className="job-card-txt-wrap">
                    <div className="job-card-txt-t">No new bookings yet</div>
                    <p className="job-card-txt-p mb-0">
                      Once clients send job requests, they will appear here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Incoming Jobs */}
            <div className="col-12 col-md-5 col-lg-5 col-xl-4 mb-3 mb-md-0">
              <div className="job-card-main">
                <div className="job-card-wrap border2-gray bg-white br14">
                  <div className="job-card-title borderb2-gray">
                    <div className="job-card-title-t">Incoming Jobs</div>
                  </div>
                  <div className="job-card-txt-wrap">
                    <div className="job-card-txt-t">No Incoming Jobs yet</div>
                    <p className="job-card-txt-p mb-0">
                      No incoming jobs yet. Keep an eye here for new job requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TeamMemberForm />
      <FleetForm />
      <DriverForm />
    </>
  );
}
