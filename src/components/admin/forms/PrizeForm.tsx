import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { Database } from "@/integrations/supabase/types";
import { PrizeFormProvider } from "./prize/PrizeFormProvider";
import { PrizeFormFields } from "./prize/PrizeFormFields";

type Prize = Database["public"]["Tables"]["prizes"]["Row"];

interface PrizeFormProps {
  prize?: Prize;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PrizeForm({ prize, onSuccess, onCancel }: PrizeFormProps) {
  return (
    <PrizeFormProvider prize={prize} onSuccess={onSuccess}>
      <Form>
        <PrizeFormFields />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </Form>
    </PrizeFormProvider>
  );
}