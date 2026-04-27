// TrackItem.jsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import api from "../api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ItemCard } from "../components/ItemCard";
import "./TrackItem.css";

export function TrackItem() {
  const [searchParams] = useSearchParams();

  const [trackId, setTrackId] = useState("");
  const [item, setItem] = useState(null);
  const [requests, setRequests] = useState([]);
  const [acceptedRequest, setAcceptedRequest] = useState(null);

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setTrackId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (trackId) {
      loadItem();
    }
  }, [trackId]);

  const loadItem = async () => {
    if (!trackId.trim()) {
      setItem(null);
      setRequests([]);
      setAcceptedRequest(null);
      alert("Enter Item ID first.");
      return;
    }

    try {
      const itemRes = await api.get(`/api/items/${trackId}`);
      const itemData = itemRes.data;

      if (!itemData) {
        throw new Error("Not found");
      }

      setItem(itemData);

      const reqRes = await api.get(`/api/requests?iId=${trackId}`);
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
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await Promise.all(
        requests.map((r) =>
          api.patch(`/api/requests/${r.id}`, {
            status:
              r.id === requestId
                ? "accepted"
                : "rejected",
          })
        )
      );

      loadItem();

    } catch (err) {
      console.error(err);
      alert("Failed to accept request");
    }
  };

  const handleHandover = async () => {
    if (!acceptedRequest) {
      alert("No accepted request found!");
      return;
    }

    try {
      await api.post("/api/handovers", {
        id: Date.now().toString(),
        iId: trackId,
        rId: acceptedRequest.id,
      });

      await api.patch(`/api/items/${trackId}`, {
        status: "closed",
      });

      alert("Handover completed successfully.");

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

        {/* SEARCH BOX */}
        <div className="glass track-search-box">
          <input
            className="track-input"
            type="text"
            placeholder="Enter Item ID (CUET-XXXXX)"
            value={trackId}
            onChange={(e) =>
              setTrackId(e.target.value)
            }
          />

          <div className="track-btn-box">
            <button
              className="btn-primary track-round-btn"
              onClick={loadItem}
            >
              Track Item
            </button>
          </div>
        </div>

        {/* ITEM DETAILS */}
        {item && (
          <>
            <div className="glass hover-card track-item-box">
              <h3 className="track-mb10">
                Item Details
              </h3>

              <ItemCard
                item={item}
                showRequest={false}
              />
            </div>

            {/* CLAIM REQUESTS */}
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
                      key={r.id}
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
                            fontWeight: "bold",
                          }}
                        >
                          {r.status === "accepted"
                            ? "✔ Accepted"
                            : "✖ Rejected"}
                        </span>
                      ) : (
                        <>
                          {r.status !== "accepted" && (
                            <button
                              className="btn-primary"
                              onClick={() =>
                                handleAcceptRequest(
                                  r.id
                                )
                              }
                            >
                              Accept
                            </button>
                          )}

                          {r.status === "accepted" && (
                            <span
                              style={{
                                color:
                                  "lightgreen",
                              }}
                            >
                              ✔ Accepted
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* HANDOVER */}
              {item.status !== "closed" &&
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

              {item.status !== "closed" &&
                !acceptedRequest &&
                requests.length > 0 && (
                  <p className="track-fade">
                    Accept a request before
                    handover.
                  </p>
                )}

              {/* CLOSED MESSAGE */}
              {item.status === "closed" && (
                <p
                  className="track-fade"
                  style={{
                    marginTop: "10px",
                  }}
                >
                  Item has been successfully
                  recovered.
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
