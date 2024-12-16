import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Event from "./pages/Event";
import Admin from "./pages/Admin";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/event/:id" element={<Event />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;