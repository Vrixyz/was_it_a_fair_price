import { FormNewItem } from "@/components/ui/new_item";

export interface ProductSchema {
  description: string,
  price_usd: number,
}

export default function SubmitProduct() {
  return (
    <>
      <FormNewItem>
      </FormNewItem>
    </>
  );
}
