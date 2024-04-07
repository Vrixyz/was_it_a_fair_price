import * as React from "react"

import { cn } from "@/lib/utils"

const FormNewItem = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className }) => (
    <form action="/api/items" method="POST" className={cn("bg-slate-700 shadow-md rounded", className)}>
        <label htmlFor="price_usd">Price in dollar US $:</label><br />
        <input placeholder="15000" className={cn("block text-gray-700 text-sm font-bold mb-2")} type="number" id="price_usd" name="price_usd" /><br />
        <label htmlFor="description">Description: (what was built, how long did it take, any other useful information.)</label><br />
        <input placeholder="Details on a past contract." className={cn("block text-gray-700 text-sm font-bold mb-2")} type="text" id="description" name="description" /><br />
        <button className={cn("shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded")} type="submit">Add New Item</button>
    </form>));

FormNewItem.displayName = "FormNewItem"


export {
    FormNewItem,
}