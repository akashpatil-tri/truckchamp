import { forwardRef, useImperativeHandle } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

import Radio from "@common/Radio";
import { EQUIPMENT_TYPES } from "@constants";
import { useJobFormStore } from "@store/useJobFormStore";

import {
  equipmentSelectionSchema,
  type EquipmentSelectionData,
} from "@/lib/schemas/job.schema";

export interface SelectEquipmentRef {
  validateForm: () => Promise<boolean>;
}

const SelectEquipment = forwardRef<SelectEquipmentRef>((_props, ref) => {
  const { formData, updateFormData } = useJobFormStore();

  const {
    formState: { errors },
    setValue,
    watch,
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
      return await trigger();
    },
  }));

  const handleEquipmentChange = (equipmentType: string) => {
    setValue("equipmentType", equipmentType, { shouldValidate: true });
    updateFormData({ equipmentType });
  };

  return (
    <div className="offcanvas-body-inner">
      <div className="offcanvas-body-title">Select Equipment Type</div>
      {errors.equipmentType && (
        <p role="alert" className="text-primary form-text mb-3">
          {errors.equipmentType?.message}
        </p>
      )}
      <div className="row gx-2 gx-xxl-3">
        {EQUIPMENT_TYPES.map((equipment) => (
          <div
            key={equipment.id}
            className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-3"
          >
            <Radio
              id={equipment.id}
              name="equipmentType"
              value={equipment.id}
              variant="square"
              checked={watch("equipmentType") === equipment.id}
              onChange={() => handleEquipmentChange(equipment.id)}
            >
              {equipment.image && (
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  className="img-fluid"
                />
              )}
              <p>{equipment.name}</p>
            </Radio>
          </div>
        ))}
      </div>
    </div>
  );
});

SelectEquipment.displayName = "SelectEquipment";

export default SelectEquipment;
