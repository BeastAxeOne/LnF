// ItemSearch.jsx
import { useState } from "react";
import "./SearchItem.css";

export function ItemSearch({ items, onFilter, searchOpen, setSearchOpen }) {
  const [search, setSearch] = useState({
    itemName: "",
    loc: "",
    date: ""
  });

  const handleSearch = () => {
    const filtered = items.filter((i) =>
      (!search.itemName || i.itemName.toLowerCase().includes(search.itemName.toLowerCase())) &&
      (!search.loc || i.loc.toLowerCase().includes(search.loc.toLowerCase())) &&
      (!search.date || i.date === search.date)
    );

    onFilter(filtered);
    setSearchOpen(false);
  };

  return (
    <>
      {searchOpen && (
        <>

          {/* OVERLAY */}
          <div
            onClick={() => setSearchOpen(false)}
            className="search-overlay"
          />

          {/* PANEL */}
          <div className="glass search-panel">
            <h3 className="search-title">
              Search Items
            </h3>

            <input
              placeholder="Item Name"
              value={search.itemName}
              onChange={(e) =>
                setSearch({ ...search, itemName: e.target.value })
              }
            />

            <input
              placeholder="Location"
              value={search.loc}
              onChange={(e) =>
                setSearch({ ...search, loc: e.target.value })
              }
            />

            <input
              type="date"
              value={search.date}
              onChange={(e) =>
                setSearch({ ...search, date: e.target.value })
              }
            />

            {/* ACTIONS */}
            <div className="search-actions">
              <button className="btn-primary search-btn" onClick={handleSearch}>
                Search
              </button>

              <button
                onClick={() => setSearchOpen(false)}
                className="close-btn"
              >
                Close
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}