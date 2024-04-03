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
import { useLoaderData, Params, Link } from 'react-router-dom';

export interface JudgementSchema {
  id: number,
  user_name: string,
  comment: string,
  rating: number,
}

export interface ItemFullSchema {
  id: number,
  user_name: string,
  description: string,
  price_usd: number,
  rating: number,
  judgements: [JudgementSchema]
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

function Item() {
  const { item_id } = useLoaderData() as { item_id: number };
  const { isLoading, data } = useSWR("/api/items/" + item_id, (url) => fetch(url).then(res => res.json()));

  return (
    <>
      <div className="fixed top-6 right-6">
        <UserButton afterSignOutUrl="/" />
      </div>
      {isLoading && <Loader className="w-4 h-4 animate-spin" />}
      {!isLoading && (
        <div><Link to={"/"} >Back</Link>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judge</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.judgements.map((item: JudgementSchema, i: number) => (
                <TableRow key={i}>
                  <TableCell>{item?.user_name}</TableCell>
                  <TableCell>{item?.comment}</TableCell>
                  <TableCell>{rating_string(item?.rating)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div >
      )
      }
    </>
  );
}

async function loader({ params }: { params: Params<"item_id"> }) {
  return { item_id: params.item_id };
}

export {
  Item,
  loader,
}