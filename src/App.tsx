import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Event from "./pages/Event";
import Admin from "./pages/Admin";
import AdminSeasons from "./components/admin/AdminSeasons";
import AdminEvents from "./components/admin/AdminEvents";
import AdminTeams from "./components/admin/AdminTeams";
import AdminPlayers from "./components/admin/AdminPlayers";
import AdminScores from "./components/admin/AdminScores";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/event/:id" element={<Event />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="seasons" element={<AdminSeasons />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="players" element={<AdminPlayers />} />
          <Route path="scores" element={<AdminScores />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;