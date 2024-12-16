import { UseFormReturn } from "react-hook-form";
import { FormInputField, FormSelectField, FormTextAreaField } from "../components/FormFields";

const EVENT_STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'CANCELLED'] as const;

interface EventDetailsSectionProps {
  form: UseFormReturn<any>;
}

export function EventDetailsSection({ form }: EventDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <FormInputField form={form} name="location" label="Location" />
      <FormSelectField
        form={form}
        name="status"
        label="Status"
        placeholder="Select status"
        options={EVENT_STATUS_OPTIONS.map((status) => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
        }))}
      />
      <FormInputField form={form} name="format" label="Format" />
      <FormTextAreaField form={form} name="details" label="Details" />
    </div>
  );
}