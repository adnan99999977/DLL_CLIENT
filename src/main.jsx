import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import router from "./routes/Route";
import AuthProvider from "./auth/AuthProvider";
import AppWrapper from "./loader/AppWrapperComponet";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </AppWrapper>
  </StrictMode>
);
