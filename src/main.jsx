import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import router from "./routes/Route";
import AuthProvider from "./auth/AuthProvider";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <Toaster position="top-center" reverseOrder={false} />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
