import {
  forwardRef,
  type ChangeEventHandler,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
  type Ref,
} from "react";

import clsx from "clsx";
import _ from "lodash";

import Icon from "@common/Icon/page";

import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export type IconNameType =
  | "queue"
  | "thirdPartyLog"
  | "amd"
  | "agreement"
  | "carrier"
  | "state"
  | "widget"
  | "alertTag"
  | "sessionTag"
  | "notification"
  | "dropDown"
  | "profile"
  | "leftarrow"
  | "dashboard"
  | "appointment"
  | "client"
  | "calendar"
  | "chat"
  | "settings"
  | "logo"
  | "phone"
  | "close"
  | "search"
  | "focusarea"
  | "paymentmethod2"
  | "therapytype2"
  | "loading"
  | "mail"
  | "website"
  | "facebook"
  | "instagram"
  | "arrow"
  | "arrowLeft"
  | "arrowTop"
  | "arrowBottom"
  | "logo-secondary"
  | "passwordEye"
  | "passwordVisible"
  | "email"
  | "lock"
  | "google"
  | "facebooklogo"
  | "user"
  | "invalidcross"
  | "validcheck"
  | "tickcircle"
  | "linear"
  | "bghighlight"
  | "loadinglogin"
  | "loadingloginbigger"
  | "loginstar"
  | "statistics"
  | "toggleArrow"
  | "logout"
  | "helpsupport"
  | "dropdownArrow"
  | "settingsBlank"
  | "reminder"
  | "meetingLink"
  | "ascSorting"
  | "descSorting"
  | "sorting"
  | "previousArrow"
  | "nextArrow"
  | "plus"
  | "warning"
  | "eye"
  | "reschedule"
  | "todotimer"
  | "todolist"
  | "heart"
  | "tickcircleblank"
  | "note"
  | "upload"
  | "message"
  | "leaf"
  | "happyemoji"
  | "lineardailymood"
  | "archeryboard"
  | "cursorpointer"
  | "play"
  | "pause"
  | "stop"
  | "location"
  | "doublemessage"
  | "transaction"
  | "announcement"
  | "calendarLeftArrow"
  | "calendarRightArrow"
  | "smallLogo"
  | "generalsetting"
  | "paymentmethod"
  | "myagreement"
  | "sessionducuments"
  | "adminStaff"
  | "therapist"
  | "list"
  | "textmessage"
  | "fillannouncement"
  | "mobilenotification"
  | "delete"
  | "edit"
  | "dollar"
  | "doubleUser"
  | "threedots"
  | "info"
  | "infoOutline"
  | "personaladdress"
  | "specialized"
  | "clinicaddress"
  | "global"
  | "license"
  | "rightArrow"
  | "roundedplus"
  | "staffmanagement"
  | "assessmentformdata"
  | "double-leaf"
  | "securityUser"
  | "clock"
  | "chevronLeft"
  | "chevronRight"
  | "dot"
  | "check"
  | "image"
  | "file"
  | "status"
  | "discard"
  | "flag"
  | "flagfill"
  | "polygonarrow"
  | "dropdownUpArrow"
  | "noResultFound"
  | "video"
  | "videoOff"
  | "mic"
  | "micOff"
  | "monitor"
  | "monitorOff"
  | "hand"
  | "phoneOff"
  | "messageSquare"
  | "wifi"
  | "wifiOff"
  | "users"
  | "alertTriangle"
  | "x"
  | "delivered"
  | "send"
  | "attachFile"
  | "singleTick"
  | "doubleTick"
  | "mute"
  | "clearMessage"
  | "chatSend"
  | "pinOff"
  | "pinIcon"
  | "seen"
  | "key"
  | "checkedFilled"
  | "checked"
  | "success"
  | "addFilled"
  | "closeRed"
  | "chatOn"
  | "talkIcon"
  | "fileNote"
  | "chatOff"
  | "brain"
  | "PendingAssessment"
  | "sync"
  | "chain"
  | "ZoomIcon"
  | "Timer"
  | "Visa"
  | "MasterCard"
  | "Amex"
  | "offline"
  | "AddUser"
  | "memopad"
  | "notfound"
  | "error"
  | "approve";

export interface InputFieldProps<TFormValues extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
  label?: string;
  labelClass?: string;
  isRequired?: boolean;
  icon?: IconNameType;
  onIconClick?: () => void;
  register?: UseFormRegister<TFormValues>;
  inputClass?: string;
  parentClassName?: string;
  inputParentClassName?: string;
  value?: string | number | undefined;
  isDisabled?: boolean;
  name?: Path<TFormValues>;
  error?: string;
  errorClass?: string;
  multiple?: boolean | undefined;
  accept?: string;
  maxLength?: number;
  iconClassName?: string;
  iconFirst?: boolean;
  lastIconParentClassName?: string;
  lastIconClassName?: string;
  viewPasswordIcon?: boolean;
  info?: string;
  infoClass?: string;
  infoIcon?: boolean;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
  show?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

export const InputField = forwardRef<
  HTMLDivElement,
  InputFieldProps<FieldValues>
>(function InputField(
  {
    onChange,
    placeholder,
    type,
    label,
    labelClass,
    isRequired,
    icon,
    onIconClick,
    register,
    inputClass,
    parentClassName,
    inputParentClassName,
    value,
    isDisabled = false,
    name = "",
    error,
    errorClass,
    multiple,
    accept,
    maxLength,
    iconClassName,
    autoComplete = "off",
    iconFirst = false,
    lastIconParentClassName,
    lastIconClassName,
    setShow,
    show = false,
    viewPasswordIcon = false,
    infoIcon = false,
    info,
    infoClass,
    inputRef,
    ...otherProps
  },
  forwardedRef
) {
  return (
    <div className={clsx("input-wrapper", parentClassName)}>
      {label && (
        <label className={clsx("input-label", labelClass)}>
          {label}
          {isRequired && <span className="input-required">*</span>}
        </label>
      )}

      <div
        className={clsx("input-inner", inputParentClassName)}
        ref={forwardedRef}
      >
        <input
          {...otherProps}
          ref={inputRef}
          type={type}
          disabled={isDisabled}
          accept={accept}
          multiple={multiple}
          {...(name && { name })}
          className={clsx(
            "input-element",
            iconFirst ? "has-icon-left" : "",
            inputClass,
            {
              "input-error": !!error,
              "input-disabled": isDisabled,
            }
          )}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
          {...(register &&
            name &&
            register(name, {
              onChange,
              setValueAs: (val) => (_.isString(val) ? val.trim() : val),
            }))}
          maxLength={maxLength}
        />

        {icon && (
          <div
            className={clsx(
              "input-icon",
              iconFirst ? "input-icon-left" : "input-icon-right",
              iconClassName
            )}
            onClick={onIconClick}
          >
            <Icon width={19} height={19} name={icon} />
          </div>
        )}

        {viewPasswordIcon && (
          <div
            className={clsx("input-password-toggle", lastIconParentClassName)}
            onClick={setShow ? () => setShow((prev) => !prev) : undefined}
          >
            <Icon
              name={show ? "passwordVisible" : "passwordEye"}
              className={clsx("input-password-icon", lastIconClassName)}
            />
          </div>
        )}
      </div>

      {info && (
        <p className={clsx("input-info", infoClass)}>
          {infoIcon && <Icon name="info" width={14} height={13} />}
          {info}
        </p>
      )}

      {error && <p className={clsx("input-error-text", errorClass)}>{error}</p>}
    </div>
  );
});

InputField.displayName = "InputField";

export default InputField;
