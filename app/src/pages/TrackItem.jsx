// TrackItem.jsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import api from "../api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ItemCard } from "../components/ItemCard";
import "./TrackItem.css";

export function TrackItem() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [trackId, setTrackId] = useState("");
  const [item, setItem] = useState(null);
  const [requests, setRequests] = useState([]);
  const [acceptedRequest, setAcceptedRequest] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // LOAD FROM URL PARAM
  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setTrackId(id);
      loadItem(id);
    }
  }, []);

  // LOAD ITEM DATA
  const loadItem = async (id = trackId) => {
    const cleanId = id.trim();

    if (!cleanId) {
      setItem(null);
      setRequests([]);
      setAcceptedRequest(null);
      alert("Enter Item ID first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const itemRes = await api.get(`/api/items/${cleanId}`);
      const itemData = itemRes.data;

      if (!itemData) {
        throw new Error("Not found");
      }

      setItem(itemData);

      const reqRes = await api.get(`/api/requests?iId=${cleanId}`);
      const reqData = reqRes.data;

      setRequests(reqData);

      const accepted = reqData.find(
        (r) => r.status === "accepted"
      );

      setAcceptedRequest(accepted || null);

    } catch (err) {
      console.error(err);

      setItem(null);
      setRequests([]);
      setAcceptedRequest(null);
      alert("Invalid Item ID");

    } finally {
      setLoading(false);
    }
  };

  // MANUAL SEARCH
  const handleTrack = () => {
    setSearchParams({ id: trackId });
    loadItem(trackId);
  };

  // ACCEPT REQUEST
  const handleAcceptRequest = async (requestId) => {
    try {
      await Promise.all(
        requests.map((r) =>
          api.patch(`/api/requests/${r._id}`, {
            status:
              r._id === requestId
                ? "accepted"
                : "rejected"
          })
        )
      );

      loadItem();

    } catch (err) {
      console.error(err);
      alert("Failed to accept request");
    }
  };

  const handleCloseItem = async () => {
    try {
      await api.patch(`/api/items/${trackId}`, {
        status: "removed"
      });
  
      //alert("Item removed successfully.");
      loadItem();
  
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  // CONFIRM HANDOVER
  const handleHandover = async () => {
    if (!acceptedRequest) {
      alert("No accepted request found.");
      return;
    }

    try {
      await api.post("/api/handovers", {
        id: Date.now().toString(),
        iId: trackId,
        rId: acceptedRequest._id
      });

      await api.patch(`/api/items/${trackId}`, {
        status: "closed"
      });

      //alert("Handover completed successfully.");

      loadItem();

    } catch (err) {
      console.error(err);
      alert("Handover failed");
    }
  };

  return (
    <>
      <Header />

      <div className="container section track-container">

        {/* HEADER */}
        <div className="glass track-header">
          <h1>Track Your Posted Item</h1>

          <p className="track-fade">
            Manage claim requests and finalize handover
          </p>
        </div>

        {/* SEARCH */}
        <div className="glass track-search-box">

          <input
            className="track-input"
            type="text"
            placeholder="Enter Item ID (CUET-XXXXX)"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
          />

          <div className="track-btn-box">
            <button
              className="btn-primary track-round-btn"
              onClick={handleTrack}
            >
              Track Item
            </button>
          </div>

        </div>

        {/* 
        {message && (
          <div className="glass" style={{ marginTop: "15px" }}>
            {message}
          </div>
        )}
        */}

        {/* LOADING */}
        {loading && (
          <div className="glass" style={{ marginTop: "15px" }}>
            Loading...
          </div>
        )}

        {/* ITEM DETAILS */}
        {item && !loading && (
          <>
            <div className="glass hover-card track-item-box">
              <h3 className="track-mb10">
                Item Details
              </h3>

              <ItemCard
                item={item}
                showRequest={false}
              />

              {item.status !== "removed" && item.status !== "closed" && (
                <div className="track-center-box">
                  <button
                    className="btn-primary"
                    onClick={handleCloseItem}
                  >
                    Close Item
                  </button>
                </div>
              )}
            </div>

            {/* CLAIMS */}
            <div className="glass track-claim-box">

              <h3>Claim Requests</h3>

              {requests.length === 0 ? (
                <p className="track-fade">
                  No claims yet.
                </p>
              ) : (
                <div className="track-grid">

                  {requests.map((r) => (
                    <div
                      key={r._id}
                      className="glass track-request-card"
                    >
                      <span>{r.mail}</span>

                      {item.status === "closed" ? (
                        <span
                          style={{
                            marginLeft: "10px",
                            color:
                              r.status === "accepted"
                                ? "lightgreen"
                                : "#ff6b6b",
                            fontWeight: "bold"
                          }}
                        >
                          {r.status === "accepted"
                            ? "✔ Accepted"
                            : "✖ Rejected"}
                        </span>
                      ) : (
                        <>
                          {r.status === "accepted" ? (
                            <span
                              style={{
                                color: "lightgreen"
                              }}
                            >
                              ✔ Accepted
                            </span>
                          ) : r.status === "rejected" ? (
                            <span
                              style={{
                                color: "#ff6b6b"
                              }}
                            >
                              ✖ Rejected
                            </span>
                          ) : !acceptedRequest ? (
                            <button
                              className="btn-primary"
                              onClick={() =>
                                handleAcceptRequest(r._id)
                              }
                            >
                              Accept
                            </button>
                          ) : null}
                        </>
                      )}

                    </div>
                  ))}

                </div>
              )}

              {/* HANDOVER */}
              {item.status !== "closed" && item.status !== "removed" &&
                acceptedRequest && (
                  <div className="track-center-box">
                    <button
                      className="btn-primary"
                      onClick={handleHandover}
                    >
                      Confirm Handover
                    </button>
                  </div>
                )}

              {item.status !== "closed" && item.status !== "removed" &&
                !acceptedRequest &&
                requests.length > 0 && (
                  <p className="track-fade">
                    Accept a request before handover.
                  </p>
                )}

              {/* CLOSED */}
              {item.status === "closed" && (
                <p
                  className="track-fade"
                  style={{ marginTop: "10px" }}
                >
                  Item has been successfully recovered.
                </p>
              )}

              {item.status === "removed" && (
                <p
                  className="track-fade"
                  style={{ marginTop: "10px" }}
                >
                  Item has been removed.
                </p>
              )}
            </div>
          </>
        )}

      </div>

      <Footer />
    </>
  );
}
