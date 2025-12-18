"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";

import Button from "@common/Button";
import Input from "@common/Input";
import { useJobFormStore } from "@store/useJobFormStore";

import {
  locationDetailsSchema,
  type LocationDetailsData,
} from "@/lib/schemas/job.schema";

const RECENT_LOCATIONS = [
  "34 Maple Street, Apt 3B, Newtown, New South Wales, 2042",
  "12 River Road, House 4, Parramatta, New South Wales, 2150",
];

export interface SelectLocationRef {
  validateForm: () => Promise<boolean>;
}

const LocationDetails = forwardRef<SelectLocationRef>((_props, ref) => {
  const { formData, updateFormData } = useJobFormStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<LocationDetailsData>({
    resolver: zodResolver(locationDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      onSiteLocation: formData.onSiteLocation,
      onSiteLocationDetails: formData.onSiteLocationDetails,
    },
  });

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      return await trigger();
    },
  }));

  useEffect(() => {
    if (!inputRef.current) return;

    const initAutocomplete = () => {
      if (!window.google?.maps?.places) {
        console.error("Google Maps Places API not loaded");
        return;
      }

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current!,
        {
          types: ["address"],
          componentRestrictions: { country: "au" },
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();

        if (place && place.formatted_address) {
          const locationData = {
            onSiteLocation: place.formatted_address,
            onSiteLocationDetails: {
              address: place.formatted_address,
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng(),
            },
          };

          setValue("onSiteLocation", locationData.onSiteLocation, {
            shouldValidate: true,
          });
          setValue(
            "onSiteLocationDetails",
            locationData.onSiteLocationDetails,
            {
              shouldValidate: true,
            }
          );
          updateFormData(locationData);
        }
      });
    };

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      // Wait for Google Maps to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkInterval);
          initAutocomplete();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);

      return () => clearInterval(checkInterval);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [setValue, updateFormData]);

  const handleRecentLocationClick = (location: string) => {
    const locationData = {
      onSiteLocation: location,
      onSiteLocationDetails: {
        address: location,
      },
    };

    setValue("onSiteLocation", locationData.onSiteLocation, {
      shouldValidate: true,
    });
    setValue("onSiteLocationDetails", locationData.onSiteLocationDetails, {
      shouldValidate: true,
    });
    updateFormData(locationData);
  };

  // Get the register result and merge with inputRef
  const { ref: registerRef, ...registerRest } = register("onSiteLocation", {
    onChange: (e) => updateFormData({ onSiteLocation: e.target.value }),
  });

  return (
    <div className="offcanvas-body-inner">
      <div className="offcanvas-body-title">Location Details</div>

      <div className="form-group">
        <label htmlFor="form-location" className="form-label">
          On Site Location
        </label>
        <Input
          {...registerRest}
          inputRef={(e) => {
            registerRef(e);
            inputRef.current = e;
          }}
          id="form-location"
          type="text"
          placeholder="Enter On Site Location"
          inputClass={`form-control border ${
            errors.onSiteLocation ? "input-error" : ""
          }`}
          aria-invalid={errors.onSiteLocation ? "true" : "false"}
          aria-describedby={
            errors.onSiteLocation ? "location-error" : undefined
          }
        />
        {errors.onSiteLocation && (
          <p
            id="location-error"
            role="alert"
            className="text-primary form-text mt-2 small"
          >
            {errors.onSiteLocation?.message}
          </p>
        )}
      </div>

      {RECENT_LOCATIONS.length > 0 && (
        <div className="recent-locations-wrap">
          <div className="recent-locations-title">Recent Location</div>
          {RECENT_LOCATIONS.map((location) => (
            <Button
              key={location}
              className="recent-location-item rounded-4"
              type="button"
              onClick={() => handleRecentLocationClick(location)}
            >
              <MapPin className="w-4 h-4 me-2 text-gray-400" />
              <span>{location}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
});

LocationDetails.displayName = "LocationDetails";

export default LocationDetails;
