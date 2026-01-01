import { forwardRef, useImperativeHandle } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

import Radio from "@common/Radio";
import { useJobFormStore } from "@store/useJobFormStore";

import { SelectEquipmentProps } from "@/lib/api/truck/truck.types";
import {
  equipmentSelectionSchema,
  type EquipmentSelectionData,
} from "@/lib/schemas/job.schema";

export interface SelectEquipmentRef {
  validateForm: () => Promise<boolean>;
}

const SelectEquipment = forwardRef<SelectEquipmentRef, SelectEquipmentProps>(
  (props, ref) => {
    const { data, isPending, isError, error } = props;

    const { formData, updateFormData } = useJobFormStore();

    const {
      formState: { errors },
      setValue,
      getValues,
      trigger,
    } = useForm<EquipmentSelectionData>({
      resolver: zodResolver(equipmentSelectionSchema),
      mode: "onBlur",
      defaultValues: {
        equipmentType: formData.equipmentType,
      },
    });

    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        return trigger();
      },
    }));

    const handleEquipmentChange = (equipmentType: string) => {
      setValue("equipmentType", equipmentType, { shouldValidate: true });
      updateFormData({ equipmentType });
    };

    if (isPending) {
      return (
        <div className="offcanvas-body-inner text-center py-5">
          <p className="mb-0">Loading equipment types…</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="offcanvas-body-inner text-center py-5">
          <p className="text-danger mb-1">Failed to load equipment types</p>
          {error && <small className="text-muted">{error?.message}</small>}
        </div>
      );
    }

    return (
      <div className="offcanvas-body-inner">
        <div className="offcanvas-body-title">Select Equipment Type</div>

        {errors.equipmentType && (
          <p role="alert" className="text-primary form-text mb-3">
            {errors.equipmentType.message}
          </p>
        )}

        <div className="row gx-2 gx-xxl-3">
          {data?.data?.map((equipment) => (
            <div
              key={equipment.id}
              className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-3"
            >
              <Radio
                id={equipment.id}
                name="equipmentType"
                value={equipment.id}
                variant="square"
                checked={getValues("equipmentType") === equipment.id}
                onChange={() => handleEquipmentChange(equipment.id)}
              >
                {equipment.image_url && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${equipment.image_url}`}
                    alt={equipment.name}
                    className="img-fluid"
                    width={100}
                    height={100}
                    unoptimized
                  />
                )}
                <p>{equipment.name}</p>
              </Radio>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

SelectEquipment.displayName = "SelectEquipment";

export default SelectEquipment;
