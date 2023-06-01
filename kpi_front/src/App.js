import "./App.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/common/Header";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <Header />
        <Dashboard />
      </QueryClientProvider>
    </>
  );
}

export default App;