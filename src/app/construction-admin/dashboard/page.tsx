"use client";

import Image from "next/image";

import jobIcon from "@assets/svg/d-job-icon.svg";
import memIcon from "@assets/svg/d-mem-icon.svg";
import JobForm from "@forms/JobForm";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

export default function Dashboard() {
  const { openOffcanvas } = useOffcanvasStore();

  const handleOpenJobForm = () => {
    openOffcanvas("offcanvasStep1");
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content">
          <div className="dashboard-tl-mob">
            <div className="dash-txt dash-txt-mob">Dashboard</div>
            <button
              className="btn offcanvas-btn offcanvas-mob"
              type="button"
              onClick={handleOpenJobForm}
            >
              Post a New Job
            </button>
          </div>
          <div className="row gx-2 gx-xl-3">
            <div className="col-md-6 mb-3">
              <div className="box-count-main">
                <div className="box-count-wrap border2-gray bg-white br14">
                  <div className="box-count-top">
                    <div className="box-count-top-wrap borderb-gray">
                      <div className="box-count-icon">
                        <Image
                          className="box-count-icon-img"
                          src={jobIcon}
                          alt="Image"
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
                        handleOpenJobForm();
                      }}
                      role="button"
                    >
                      + Add New Job
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="box-count-main">
                <div className="box-count-wrap border2-gray bg-white br14">
                  <div className="box-count-top">
                    <div className="box-count-top-wrap borderb-gray">
                      <div className="box-count-icon">
                        <Image
                          className="box-count-icon-img"
                          src={memIcon}
                          alt="Image"
                        />
                      </div>
                      <div className="box-count-txt-wrap ps-2">
                        <div className="box-count-head">00</div>
                        <div className="box-count-shead">
                          Total Team Members
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="box-count-bottom">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Implement team member offcanvas
                      }}
                      role="button"
                    >
                      + Add Team Members
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row gx-2 gx-xl-3">
            <div className="col-12 col-md-7 col-lg-7 col-xl-8 mb-3 mb-md-0">
              <div className="job-card-main">
                <div className="job-card-wrap border2-gray bg-white br14">
                  <div className="job-card-title borderb2-gray">
                    <div className="job-card-title-t">Running Job</div>
                  </div>
                  <div className="job-card-txt-wrap">
                    <div className="job-card-txt-t">No new bookings yet</div>
                    <p className="job-card-txt-p mb-0">
                      No jobs have been posted yet. Click ‘Post a New Job’ to
                      create one.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 col-lg-5 col-xl-4 mb-3 mb-md-0">
              <div className="job-card-main">
                <div className="job-card-wrap border2-gray bg-white br14">
                  <div className="job-card-title borderb2-gray job-card-title-space">
                    <div className="job-card-title-t">Jobs Request</div>
                    <div className="job-card-title-link-wrap">
                      <a href="#" className="job-card-title-link">
                        View All
                      </a>
                    </div>
                  </div>
                  <div className="job-card-txt-wrap">
                    <div className="job-card-txt-t">
                      No Incoming Job Request yet
                    </div>
                    <p className="job-card-txt-p mb-0">
                      No incoming jobs yet. Keep an eye here
                      <br /> for new job requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <JobForm />
    </>
  );
}
