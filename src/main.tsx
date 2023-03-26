import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "./context/userContext";

import App from "./App";
import "./index.css";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserContextProvider>
      <CookiesProvider>
        <QueryClientProvider client={client}>
          <Router>
            <App />
          </Router>
        </QueryClientProvider>
      </CookiesProvider>
    </UserContextProvider>
  </React.StrictMode>
);
