
import { Button } from "@/components/ui/button";
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
      <div className="space-y-4">
        <PrizeFormFields />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" form="prize-form">Save</Button>
        </div>
      </div>
    </PrizeFormProvider>
  );
}
