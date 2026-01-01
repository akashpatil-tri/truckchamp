import Checkbox from "@common/Checkbox";
import Input from "@common/Input";
import Radio from "@common/Radio";

import { formatString } from "@/lib/utils/commanizeString.utils";

export interface Property {
  id: string;
  property_key: string;
  property_label: string;
  html_type: string;
  options: string[] | null;
  is_required: boolean;
  min_value: number | null;
  max_value: number | null;
  parent_property_id: string | null;
  is_read_only: boolean;
  default_value: string | null;
  has_extra_charge: boolean;
  help_text: string | null;
}

export type PropertyValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined;

interface DynamicPropertyFieldsProps {
  properties: Property[];
  values: Record<string, PropertyValue>;
  onChange: (key: string, value: PropertyValue) => void;
  errors?: Record<string, string>;
}

export default function DynamicPropertyFields({
  properties,
  values,
  onChange,
  errors = {},
}: DynamicPropertyFieldsProps) {
  const renderField = (property: Property) => {
    const {
      property_key,
      property_label,
      html_type,
      options,
      is_required,
      min_value,
      max_value,
      is_read_only,
      default_value,
      has_extra_charge,
      help_text,
    } = property;

    const value = values?.[property_key];
    const error = errors?.[property_key];

    // Read-only field (info display)
    if (is_read_only) {
      return (
        <div key={property_key} className="form-group">
          <label className="form-label">{property_label}</label>
          {/* <div className="alert alert-info"> */}
          <Input
            id={property_key}
            type="text"
            value={default_value!}
            inputClass={`form-control border ${error ? "input-error" : ""}`}
            readOnly={true}
          />
          {/* <i className="bi bi-info-circle me-2"></i>
            {default_value || property_label}
          </div> */}
          {help_text && <small className="text-muted">{help_text}</small>}
        </div>
      );
    }

    // Radio input (single select)
    if (html_type === "radio-input" && options) {
      return (
        <div key={property_key} className="form-group">
          <label className="form-label">
            {property_label}
            {is_required && <span className="text-danger"> *</span>}
          </label>
          {help_text && <p className="fs-12 cgray mb-2">{help_text}</p>}
          <div className="radio-rounded-main">
            {options.map((option, index) => (
              <Radio
                key={option}
                id={`${property_key}_${index}`}
                name={property_key}
                value={option}
                variant="rounded"
                checked={value === option}
                onChange={() => onChange(property_key, option)}
              >
                {option}
                {has_extra_charge && (
                  <span className="badge bg-warning text-dark ms-2">
                    Extra Charge
                  </span>
                )}
              </Radio>
            ))}
          </div>
          {error && (
            <p role="alert" className="text-primary form-text mt-2 small">
              {error}
            </p>
          )}
        </div>
      );
    }

    // Checkbox input (multi-select)
    if (html_type === "checkbox-input" && options) {
      const selectedValues = Array.isArray(value) ? value : [];

      return (
        <div key={property_key} className="form-group">
          <label className="form-label">
            {property_label}
            {is_required && <span className="text-danger"> *</span>}
          </label>
          {help_text && <p className="fs-12 cgray mb-2">{help_text}</p>}
          <div className="checkbox-square-main">
            {options.map((option, index) => (
              <Checkbox
                key={option}
                id={`${property_key}_${index}`}
                name={`${property_key}_${index}`}
                label={
                  <>
                    {formatString(option)}
                    {has_extra_charge && (
                      <span className="badge bg-warning text-dark ms-2">
                        Extra Charge
                      </span>
                    )}
                  </>
                }
                value={option}
                checked={selectedValues.includes(option)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...selectedValues, option]
                    : selectedValues.filter((v) => v !== option);
                  onChange(property_key, newValues);
                }}
              />
            ))}
          </div>
          {error && (
            <p role="alert" className="text-primary form-text mt-2 small">
              {error}
            </p>
          )}
        </div>
      );
    }

    // Single checkbox (boolean)
    if (html_type === "checkbox-input" && !options) {
      return (
        <div key={property_key} className="form-group">
          <div className="checkbox-square-main">
            <Checkbox
              id={property_key}
              name={property_key}
              label={
                <>
                  {formatString(property_label)}
                  {is_required && <span className="text-danger"> *</span>}
                  {has_extra_charge && (
                    <span className="badge bg-warning text-dark ms-2">
                      Extra Charge
                    </span>
                  )}
                </>
              }
              value={property_key}
              checked={!!value}
              onChange={(e) => onChange(property_key, e.target.checked)}
            />
          </div>
          {help_text && (
            <small className="text-muted d-block mt-1">{help_text}</small>
          )}
          {error && (
            <p role="alert" className="text-primary form-text mt-2 small">
              {error}
            </p>
          )}
        </div>
      );
    }

    // Number input
    if (html_type === "number-input") {
      return (
        <div key={property_key} className="form-group">
          <label htmlFor={property_key} className="form-label">
            {property_label}
            {is_required && <span className="text-danger"> *</span>}
          </label>
          {help_text && <p className="fs-12 cgray mb-2">{help_text}</p>}
          <Input
            id={property_key}
            type="number"
            placeholder={`Enter ${property_label}`}
            value={
              typeof value === "number" || typeof value === "string"
                ? value
                : ""
            }
            onChange={(e) =>
              onChange(
                property_key,
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            inputClass={`form-control border ${error ? "input-error" : ""}`}
            min={min_value || undefined}
            max={max_value || undefined}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${property_key}-error` : undefined}
          />
          {(min_value || max_value) && (
            <small className="text-muted mt-2 d-block">
              {min_value && max_value
                ? `Range: ${min_value} - ${max_value}`
                : min_value
                ? `Minimum: ${min_value}`
                : `Maximum: ${max_value}`}
            </small>
          )}
          {error && (
            <p
              id={`${property_key}-error`}
              role="alert"
              className="text-primary form-text mt-2 small"
            >
              {error}
            </p>
          )}
        </div>
      );
    }

    // Range input (slider)
    if (html_type === "range-input") {
      const sliderValue =
        typeof value === "number"
          ? value
          : typeof value === "string" && value !== "" && !isNaN(Number(value))
          ? Number(value)
          : min_value ?? 0;

      return (
        <div key={property_key} className="form-group">
          <label htmlFor={property_key} className="form-label">
            {property_label}
            {is_required && <span className="text-danger"> *</span>}
          </label>
          {help_text && <p className="fs-12 cgray mb-2">{help_text}</p>}
          <div className="d-flex align-items-center gap-3">
            <input
              id={property_key}
              type="range"
              className="form-range flex-grow-1"
              min={min_value ?? 0}
              max={max_value ?? 100}
              value={sliderValue}
              onChange={(e) => onChange(property_key, Number(e.target.value))}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `${property_key}-error` : undefined}
            />
            <span className="fw-bold">{sliderValue}</span>
          </div>
          {error && (
            <p
              id={`${property_key}-error`}
              role="alert"
              className="text-primary form-text mt-2 small"
            >
              {error}
            </p>
          )}
        </div>
      );
    }

    // Text input (default)
    return (
      <div key={property_key} className="form-group">
        <label htmlFor={property_key} className="form-label">
          {property_label}
          {is_required && <span className="text-danger"> *</span>}
        </label>
        {help_text && <p className="fs-12 cgray mb-2">{help_text}</p>}
        <Input
          id={property_key}
          type="text"
          placeholder={`Enter ${property_label}`}
          value={
            typeof value === "number"
              ? value
              : value == null
              ? ""
              : Array.isArray(value)
              ? value.join(", ")
              : String(value)
          }
          onChange={(e) => onChange(property_key, e.target.value)}
          inputClass={`form-control border ${error ? "input-error" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${property_key}-error` : undefined}
        />
        {error && (
          <p
            id={`${property_key}-error`}
            role="alert"
            className="text-primary form-text mt-2 small"
          >
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="dynamic-properties">
      {properties.map((property) => renderField(property))}
    </div>
  );
}
