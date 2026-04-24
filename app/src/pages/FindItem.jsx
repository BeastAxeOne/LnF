import { useEffect, useState } from "react";
import api from "../api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ItemCard } from "../components/ItemCard";
import { ItemSearch } from "../components/SearchItem";

export function FindItem() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const res = await api.get("/api/items?status=active");
    setItems(res.data);
    setFiltered(res.data);
  };

  return (
    <>
      <Header />

      <div className="container section">

        {/* PAGE HEADER */}
        <div className="glass" style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1>Lost Something?</h1>
          <p style={{ opacity: 0.7 }}>
            Browse or search items found across CUET campus
          </p>

          <button
            className="btn-primary"
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ marginTop: "15px" }}
          >
            🔍 Filtered Search
          </button>
        </div>

        {/* SEARCH PANEL */}
        <ItemSearch
          items={items}
          onFilter={setFiltered}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
        />

        {/* RESULTS SECTION */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "15px" }}>
            Available Items ({filtered.length})
          </h3>

          <div className="items-grid">
            {filtered.length === 0 ? (
              <div className="glass" style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ opacity: 0.7 }}>No items found</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div key={item.id} className="hover-card">
                  <ItemCard item={item} showRequest={true} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
