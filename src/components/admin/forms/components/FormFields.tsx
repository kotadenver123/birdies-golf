import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface FormInputFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  type?: string;
}

export function FormInputField({ form, name, label, type = "text" }: FormInputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormTextAreaFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

export function FormTextAreaField({ form, name, label }: FormTextAreaFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormSelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
}

export function FormSelectField({
  form,
  name,
  label,
  options,
  placeholder,
}: FormSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}