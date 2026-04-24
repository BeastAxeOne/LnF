import { useState, useEffect } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ItemCard } from "../components/ItemCard";
import "./HomePage.css";

export function HomePage() {
  const [items, setItems] = useState([]);
  const [trackId, setTrackId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const res = await api.get("/api/items?status=active");
    setItems(res.data);
  };

  const handleTrack = () => {
    if (!trackId.trim()) return;
    navigate(`/track?id=${trackId}`);
  };

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">

          <div className="hero-box glass">
            <h1>CUET Lost & Found</h1>

            <p>A COMMUNITY SERVICE PLATFORM MADE BY CUETIANS FOR CUET</p>

            {/* ACTION BUTTONS */}
            <div className="hero-actions">
              <Link to="/postitem" className="btn-primary">
                Found Something
              </Link>

              <Link to="/finditem" className="btn-primary">
                Lost Something
              </Link>
            </div>

            {/* TRACK BOX */}
            <div className="track-box glass">
              <div className="track-input-group">
                <h3>Track Your Post:</h3>

                <input
                  type="text"
                  placeholder="Enter Item ID (CUET-XXXXX)"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                />

                <button className="btn-primary" onClick={handleTrack}>
                  Track
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ITEMS SECTION */}
      <section className="container section">
        <h2>Recently Found Items</h2>

        <div className="items-grid">
          {items.slice(0, 3).map((item) => (
            <div className="hover-card" key={item.id}>
              <ItemCard item={item} showRequest={false} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
