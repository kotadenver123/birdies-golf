import { UseFormReturn } from "react-hook-form";
import { FormInputField } from "../components/FormFields";

interface DateTimeSectionProps {
  form: UseFormReturn<any>;
}

export function DateTimeSection({ form }: DateTimeSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormInputField form={form} name="event_date" label="Date" type="date" />
      <FormInputField form={form} name="event_time" label="Time" type="time" />
    </div>
  );
}