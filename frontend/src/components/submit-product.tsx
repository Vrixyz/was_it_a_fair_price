import { FormNewItem } from "@/components/ui/new_item";
import { UserButton } from "@clerk/clerk-react";

export interface ProductSchema {
  description: string,
  price_usd: number,
}

export default function SubmitProduct() {
  return (
    <>
      <div className="fixed top-6 right-6">
        <UserButton afterSignOutUrl="/" />
      </div>
      <FormNewItem>
      </FormNewItem>
    </>
  );
}
