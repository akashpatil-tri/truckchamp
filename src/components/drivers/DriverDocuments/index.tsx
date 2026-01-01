import type { DriverDocuments as DriverDocumentsType } from "@/types/driver.types";

interface DriverDocumentsProps {
  documents: DriverDocumentsType;
}

const documentLabels: Record<keyof DriverDocumentsType, string> = {
  driver_license: "Driver's License",
  white_card: "White Card",
  voc: "VOC (Verification of Competency)",
  high_risk_work_license: "High Risk Work License",
};

export default function DriverDocuments({ documents }: DriverDocumentsProps) {
  const hasDocuments = Object.values(documents).some((doc) => doc);

  return (
    <div className="mb-4">
      <h6 className="fw-bold mb-3">Certificate & Document</h6>

      {!hasDocuments ? (
        <div className="text-center py-4 border2-gray br10">
          <p className="cgray fs-14 mb-0">No documents uploaded</p>
        </div>
      ) : (
        <div className="row g-3">
          {(Object.keys(documents) as Array<keyof DriverDocumentsType>).map(
            (key) =>
              documents[key] && (
                <div key={key} className="col-md-6 col-lg-4">
                  <div className="document-preview p-3 br10 border2-gray text-center">
                    <div className="mb-2 mx-auto d-flex align-items-center justify-content-center doc-preview-thumbnail">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <path
                          d="M8 4H20L26 10V28H8V4Z"
                          stroke="#797979"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 4V10H26"
                          stroke="#797979"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="cgray fs-12 mb-2">{documentLabels[key]}</p>
                    <button
                      type="button"
                      className="btn btn-outline minw-auto px-3 py-1 fs-12 br6"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
