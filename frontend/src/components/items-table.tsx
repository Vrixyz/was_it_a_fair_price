import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserButton } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import useSWR from "swr";
import { useNavigate } from 'react-router-dom';
import SubmitProduct from "./submit-product";
import { useState } from "react";

export interface ItemSchema {
  id: number,
  user_name: string,
  description: string,
  price_usd: number,
  rating: number,
}

function rating_string(rating?: number) {
  if (rating == null) {
    return "Not enough evaluations yet.";
  }
  const ratings = [
    "Way too expensive",
    "A bit too expensive",
    "Fair",
    "A bit too cheap",
    "Way too cheap"
  ];
  var rating_int = Math.round(rating);
  if (0 <= rating && rating < ratings.length) {
    return ratings[rating_int];
  }
  return "Unknown rating."
}

export default function UsersTable() {
  const { isLoading, data } = useSWR("/api/items", (url) => fetch(url).then(res => res.json()));

  const navigate = useNavigate();

  const [isAddingNewItem, setAddingNewItem] = useState(false);
  return (
    <>
      <div className="fixed top-6 right-6">
        <UserButton afterSignOutUrl="/" />
      </div>
      {isLoading && <Loader className="w-4 h-4 animate-spin" />}
      {!isLoading && (
        <div><a onClick={() => { setAddingNewItem(!isAddingNewItem); }}>{(!isAddingNewItem && "Submit new Item") || "Cancel addition"}</a>
          {
            isAddingNewItem && SubmitProduct()
          }
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitter</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: ItemSchema, i: number) => (
                <TableRow key={i} onClick={() => navigate("/items/" + item.id)}>
                  <TableCell>{item?.user_name}</TableCell>
                  <TableCell>{item?.description}</TableCell>
                  <TableCell>{item?.price_usd}</TableCell>
                  <TableCell>{
                    rating_string(item?.rating)
                  }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div >
      )
      }
    </>
  );
}
