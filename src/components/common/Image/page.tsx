"use client";

import React, { useState } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";

type ImgPathType = string | File;

interface CustomImageProps extends Omit<NextImageProps, "src" | "alt"> {
  imgPath: ImgPathType;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  firstName?: string;
  lastName?: string;
  initialClassName?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
  quality?: number;
  sizes?: string;
  unoptimized?: boolean;
}

export const Image: React.FC<CustomImageProps> = ({
  imgPath,
  width,
  height,
  className = "",
  imageClassName = "",
  alt = "",
  onClick,
  firstName,
  lastName,
  initialClassName = "",
  fill = false,
  objectFit = "cover",
  priority = false,
  quality = 75,
  sizes,
  unoptimized = false,
  ...restProps
}) => {
  const [hasError, setHasError] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Get file path or blob URL
  const getFilePath = (path: ImgPathType | undefined): string | undefined => {
    if (path instanceof File) {
      try {
        if (!blobUrl) {
          const url = URL.createObjectURL(path);
          setBlobUrl(url);
          return url;
        }
        return blobUrl;
      } catch {
        setHasError(true);
        return undefined;
      }
    }
    if (typeof path === "string") {
      return path;
    }
    return undefined;
  };

  // Cleanup blob URL on unmount
  React.useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  // Render fallback (initials or default image)
  const renderFallback = () => {
    if (firstName || lastName) {
      const initials = `${firstName?.charAt(0) ?? ""}${
        lastName?.charAt(0) ?? ""
      }`;
      return (
        <div
          onClick={onClick}
          className={`flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xl md:text-3xl rounded-full ${initialClassName} ${className}`}
          style={
            !fill && width && height
              ? { width: `${width}px`, height: `${height}px` }
              : {}
          }
        >
          {initials.toUpperCase()}
        </div>
      );
    }

    // Default fallback image
    return (
      <div className={`relative ${className}`}>
        {fill ? (
          <NextImage
            src="/images/default-user-image.png"
            alt={alt || "Default user image"}
            fill
            style={{ objectFit }}
            className={imageClassName}
            onClick={onClick}
            onError={() => setHasError(true)}
            quality={quality}
            sizes={sizes}
            {...restProps}
          />
        ) : (
          <NextImage
            src="/images/default-user-image.png"
            alt={alt || "Default user image"}
            width={width || 100}
            height={height || 100}
            style={{ objectFit }}
            className={imageClassName}
            onClick={onClick}
            onError={() => setHasError(true)}
            quality={quality}
            {...restProps}
          />
        )}
      </div>
    );
  };

  const filePath = imgPath && !hasError ? getFilePath(imgPath) : undefined;

  // If no valid path or error, show fallback
  if (!filePath || hasError) {
    return renderFallback();
  }

  // Determine if this is an external URL or blob
  const isExternal =
    filePath.startsWith("http") || filePath.startsWith("blob:");

  return (
    <div className={`relative ${className}`}>
      {fill ? (
        <NextImage
          src={filePath}
          alt={alt}
          fill
          style={{ objectFit }}
          className={imageClassName}
          onClick={onClick}
          onError={() => setHasError(true)}
          priority={priority}
          quality={quality}
          sizes={sizes}
          unoptimized={isExternal || unoptimized}
          {...restProps}
        />
      ) : (
        <NextImage
          src={filePath}
          alt={alt}
          width={width || 100}
          height={height || 100}
          style={{ objectFit }}
          className={imageClassName}
          onClick={onClick}
          onError={() => setHasError(true)}
          priority={priority}
          quality={quality}
          unoptimized={isExternal || unoptimized}
          {...restProps}
        />
      )}
    </div>
  );
};

export default Image;
