import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import Settings from "./Components/Setting";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContextProvider from "./Components/Context/UserContext";
import AuthRoute from "./Components/AuthRoute";
import ProtectedRoute from "./Components/ProtectedRoute";
import Postdetailes from "./Components/Postdetailes";

const query = new QueryClient();
const router = createHashRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      {
        path: "postdetailes/:id",
        element: <ProtectedRoute><Postdetailes /></ProtectedRoute>,
      },
      {
        path: "setting",
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: "profile",
        element:<ProtectedRoute> <Profile /></ProtectedRoute>,
      },
      {
        path: "login",
        element: <AuthRoute><Login /></AuthRoute>,
      },
      {
        path: "/",
        element: <AuthRoute><Register /></AuthRoute>,
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <UserContextProvider>
        <QueryClientProvider client={query}>
          <RouterProvider router={router}></RouterProvider>
        </QueryClientProvider>
      </UserContextProvider>
    </>
  );
}
