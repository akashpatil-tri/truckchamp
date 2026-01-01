import Image from "next/image";

import noData from "@assets/images/no-data.jpg"

interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
  showImage?: boolean
}

export default function EmptyState({
  title,
  description,
  className = "",
  showImage = false
}: EmptyStateProps) {
  return (
    <div className={`text-center py-3 px-3 ${className}`}>
      {showImage && <Image src={noData} width={800} height={800} alt="no-data" />}
      <p className="fw-bold mb-2">{title}</p>
      <p className="cgray fs-14 mb-0">{description}</p>
    </div>
  );
}
