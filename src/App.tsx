import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Event from "@/pages/Event";
import Admin from "@/pages/Admin";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminSeasons from "@/components/admin/AdminSeasons";
import AdminTeams from "@/components/admin/AdminTeams";
import AdminPlayers from "@/components/admin/AdminPlayers";
import AdminScores from "@/components/admin/AdminScores";
import AdminPrizes from "@/components/admin/AdminPrizes";
import AdminSponsors from "@/components/admin/AdminSponsors";
import NotFound from "@/pages/NotFound";
import Navbar from "@/components/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/event/:id" element={<Event />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminEvents />} />
          <Route path="seasons" element={<AdminSeasons />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="players" element={<AdminPlayers />} />
          <Route path="scores" element={<AdminScores />} />
          <Route path="prizes" element={<AdminPrizes />} />
          <Route path="sponsors" element={<AdminSponsors />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;