import "./App.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/common/Header";
import { QueryClient, QueryClientProvider } from "react-query";
import { router } from "./router/router";
import { RouterProvider } from "react-router";
function App() {
  return (
    <>
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                refetchOnWindowFocus: false,
              },
            },
          })
        }
      >
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
