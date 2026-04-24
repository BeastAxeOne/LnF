import { Routes, Route } from "react-router";
import "./App.css";

import { HomePage } from "./pages/HomePage";
import { PostItem } from "./pages/PostItem";
import { FindItem } from "./pages/FindItem";
import { ConfirmItem } from "./pages/ConfirmItem";
import { TrackItem } from "./pages/TrackItem";
import { AboutUs } from "./pages/AboutUs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/postitem" element={<PostItem />} />
      <Route path="/finditem" element={<FindItem />} />
      <Route path="/confirm" element={<ConfirmItem />} />
      <Route path="/track" element={<TrackItem />} />
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
}

export default App;