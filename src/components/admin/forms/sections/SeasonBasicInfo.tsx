import { UseFormReturn } from "react-hook-form";
import { FormInputField } from "../components/FormFields";

interface SeasonBasicInfoProps {
  form: UseFormReturn<any>;
}

export function SeasonBasicInfo({ form }: SeasonBasicInfoProps) {
  return (
    <div className="space-y-4">
      <FormInputField
        form={form}
        name="title"
        label="Title"
      />
      <FormInputField
        form={form}
        name="start_date"
        label="Start Date"
        type="date"
      />
      <FormInputField
        form={form}
        name="end_date"
        label="End Date"
        type="date"
      />
    </div>
  );
}