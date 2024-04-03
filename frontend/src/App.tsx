import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
//import UsersTable from "./components/users-table";
import ItemsTable from "./components/items-table";
import { Item, loader as itemLoader } from "./components/item";

import { ClerkProvider } from '@clerk/clerk-react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from "./error-page";


// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <ItemsTable />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/items/:item_id",
    element:
      <Item />,
    errorElement: <ErrorPage />,
    loader: itemLoader,
  },
]);

function App() {
  return (

    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignedOut>
          <SignIn />
        </SignedOut>
        <SignedIn>
          <RouterProvider router={router} />
        </SignedIn>
      </main>
    </ClerkProvider>
  );
}

export default App;
