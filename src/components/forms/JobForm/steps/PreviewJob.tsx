"use client";

import { format } from "date-fns";
import Image from "next/image";

import locDeImg from "@assets/images/loc-de-img.png";
import locDeMap from "@assets/images/loc-de-map.png";
import { EQUIPMENT_TYPES } from "@constants";
import { useJobFormStore } from "@store/useJobFormStore";
import { useOffcanvasStore } from "@store/useOffcanvasStore";


export default function PreviewJob() {
  const { formData } = useJobFormStore();
  const { openOffcanvas } = useOffcanvasStore();

  const selectedEquipment = EQUIPMENT_TYPES.find(
    (e) => e.id === formData.equipmentType
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd MMM, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "hh:mm a");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return "";
    const date = formatDate(dateStr);
    const time = timeStr ? formatTime(timeStr) : "";
    return `${date} ${time}`.trim();
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return "";
    try {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours.toString().padStart(2, "0")} Hours`;
    } catch {
      return "";
    }
  };

  return (
    <div className="offcanvas-body-inner">
      <div className="content-bbox-main">
        {/* Equipment Details */}
        <div className="content-bbox-wrap border2-gray br14">
          <div className="content-bbox-ht borderb2-gray d-flex flex-wrap justify-content-between align-items-center py-3">
            <div className="content-bbox-tl">Equipment Details</div>
            <div className="content-bbox-hl">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openOffcanvas("offcanvasStep1");
                }}
              >
                Edit Equipment Details
              </a>
            </div>
          </div>
          <div className="content-bbox-cn cp-20">
            {selectedEquipment && (
              <div className="content-bbox-imgtxt d-flex flex-wrap align-items-center">
                <div className="content-bbox-img">
                  <Image
                    src={selectedEquipment.image}
                    alt={selectedEquipment.name}
                    width={80}
                    height={80}
                    className="img-fluid"
                  />
                </div>
                <div className="content-bbox-txt-wrap">
                  <div className="content-bbox-txt-sh">Truck Type</div>
                  <div className="content-bbox-txt--mh">
                    {selectedEquipment.name}
                  </div>
                </div>
              </div>
            )}
            <hr className="my-3" />
            <div className="gray-box-main d-flex flex-wrap justify-content-between">
              {formData.lineLength && (
                <div className="gray-box-wrap">
                  <div className="gray-box-tl">Line Length</div>
                  <div className="gray-box-m">
                    <div className="gray-box">{formData.lineLength}</div>
                  </div>
                </div>
              )}
              {formData.volume && (
                <div className="gray-box-wrap">
                  <div className="gray-box-tl">Volume (m³)</div>
                  <div className="gray-box-m">
                    <div className="gray-box">{formData.volume} m³</div>
                  </div>
                </div>
              )}
              {formData.aggregateTypes &&
                formData.aggregateTypes.length > 0 && (
                  <div className="gray-box-wrap gray-box-sm-space">
                    <div className="gray-box-tl">Aggregate</div>
                    <div className="gray-box-m">
                      {formData.aggregateTypes.map((type) => (
                        <div key={type} className="gray-box">
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {formData.jobDetails && formData.jobDetails.length > 0 && (
              <div className="gray-box-main">
                <div className="gray-box-wrap gray-box-sm-space">
                  <div className="gray-box-tl">Job Details</div>
                  {formData.jobDetails.map((detail) => (
                    <div key={detail} className="gray-box">
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.washoutOption && formData.washoutOption.length > 0 && (
              <div className="gray-box-main">
                <div className="gray-box-wrap gray-box-sm-space">
                  <div className="gray-box-tl">Washout Options</div>
                  {formData.washoutOption.map((option) => (
                    <div key={option} className="gray-box">
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.notes && (
              <>
                <hr className="my-3" />
                <div className="note-wrap">
                  <div className="note-wrap-tl">Note:</div>
                  <p className="note-wrap-txt mb-0">{formData.notes}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="content-bbox-wrap border2-gray br14">
          <div className="content-bbox-ht borderb2-gray d-flex flex-wrap justify-content-between align-items-center py-3">
            <div className="content-bbox-tl">Location Details</div>
            <div className="content-bbox-hl">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openOffcanvas("offcanvasStep3");
                }}
              >
                Edit Location Details
              </a>
            </div>
          </div>
          <div className="content-bbox-cn cp-20">
            <div className="loc-de-box-main">
              <div className="loc-de-box-wrap">
                <div className="loc-de-stet-col">
                  <div className="loc-de-stet">
                    <div className="loc-de-im">
                      <Image src={locDeImg} alt="Location" className="img" />
                    </div>
                    <div className="loc-de-twrap">
                      <div className="loc-de-tadd">
                        {formData.onSiteLocation || "Location not specified"}
                      </div>
                      <div className="loc-de-timadd">
                        Starting at{" "}
                        {formatDateTime(formData.startDate, formData.startTime)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="loc-de-hr-col">
                  <div className="loc-de-hr">{calculateDuration()}</div>
                </div>
                <div className="loc-de-stet-col">
                  <div className="loc-de-stet">
                    <div className="loc-de-im">
                      <Image src={locDeMap} alt="Location" className="img" />
                    </div>
                    <div className="loc-de-twrap">
                      <div className="loc-de-tadd">
                        {formData.onSiteLocation || "Location not specified"}
                      </div>
                      <div className="loc-de-timadd">
                        Ending at{" "}
                        {formatDateTime(formData.endDate, formData.endTime)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule / Recurring Days */}
        <div className="content-bbox-wrap border2-gray br14">
          <div className="content-bbox-ht borderb2-gray d-flex flex-wrap justify-content-between align-items-center py-3">
            <div className="content-bbox-tl">Schedule Your Recurring Days</div>
            <div className="content-bbox-hl">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Do nothing for now
                }}
              >
                Edit Days
              </a>
            </div>
          </div>
          <div className="content-bbox-cn cp-20">
            {formData.recurringDays && formData.recurringDays.length > 0 && (
              <div className="srdays-wrap">
                <div className="srdays-tl">Your Recurring Days</div>
                <div className="srdays-list d-flex flex-wrap">
                  {formData.recurringDays.map((day) => (
                    <div key={day} className="srdays-d">
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="mt-3" />
            <div className="recurr-timing-main">
              <div className="recurr-timing-wrap">
                <div className="recurr-timing-ht">
                  <div className="recurr-timing-tl">
                    Exact timing required ?
                  </div>
                  <div className="recurr-timing-txt">
                    Enable this if the job must start at an exact time.
                  </div>
                </div>
                <div className="recurr-timing-icon">
                  <div className="apple-toggle-wrap">
                    <div className="form-group mb-0">
                      <input
                        type="checkbox"
                        className="checkbox"
                        id="atoggle-preview"
                        checked={formData.exactTimingRequired}
                        readOnly
                        disabled
                      />
                      <label htmlFor="atoggle-preview" className="mb-0"></label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="recurr-timing-content1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
