import { UseFormReturn } from "react-hook-form";
import { FormInputField, FormSelectField } from "../components/FormFields";

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
  seasons: any[];
}

export function BasicInfoSection({ form, seasons }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <FormInputField form={form} name="title" label="Title" />
      <FormSelectField
        form={form}
        name="season_id"
        label="Season"
        placeholder="Select a season"
        options={seasons?.map((season) => ({
          value: season.id,
          label: season.title,
        })) || []}
      />
    </div>
  );
}