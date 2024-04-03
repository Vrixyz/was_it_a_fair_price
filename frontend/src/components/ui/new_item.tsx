import * as React from "react"

import { cn } from "@/lib/utils"

const FormNewItem = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className }) => (
    <form className={cn("w-full caption-bottom text-sm", className)}>
        <label>Price in dollar US $:</label><br />
        <input type="number" id="price_usd" name="price" /><br />
        <label>Description: (what was built, how long did it take, any other useful information.)</label><br />
        <input type="text" id="description" name="description" /><br />
    </form>));

FormNewItem.displayName = "FormNewItem"


export {
    FormNewItem,
}