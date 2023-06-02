import "./App.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/common/Header";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
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
          <Header />
          <Dashboard />
        </QueryClientProvider>
      </Router>
    </>
  );
}

export default App;
