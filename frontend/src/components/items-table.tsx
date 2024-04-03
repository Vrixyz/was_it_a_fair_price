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

export interface ItemSchema {
  description: string,
  price: number,
  rating: number,
}

export default function UsersTable() {
  const { isLoading, data } = useSWR("/api/items", (url) => fetch(url).then(res => res.json()));

  return (
    <>
      <div className="fixed top-6 right-6">
        <UserButton afterSignOutUrl="/" />
      </div>
      {isLoading && <Loader className="w-4 h-4 animate-spin" />}
      {!isLoading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user: ItemSchema, i: number) => (
              <TableRow key={i}>
                <TableCell>{user?.description}</TableCell>
                <TableCell>{user?.price}</TableCell>
                <TableCell>{user?.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
