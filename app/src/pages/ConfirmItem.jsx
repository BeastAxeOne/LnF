// ConfirmItem.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import api from "../api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "./ConfirmItem.css";

export function ConfirmItem() {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.state?.itemId || sessionStorage.getItem("confirmItemId");

  const [qna, setQna] = useState(null);
  const [item, setItem] = useState(null);

  const [mail, setMail] = useState("");
  const [ans1, setAns1] = useState("");
  const [ans2, setAns2] = useState("");
  const [ans3, setAns3] = useState("");

  const [founderMail, setFounderMail] = useState("");

  const cuetMail = /^u\d+@student\.cuet\.ac\.bd$/i;

  useEffect(() => {
    if (!id) {
      navigate("/finditem");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    const itemRes = await api.get(`/api/items/${id}`);
    setItem(itemRes.data);

    const qRes = await api.get(`/api/qna?iId=${id}`);
    setQna(qRes.data[0]);
  };

  const handleSubmit = async () => {
    if (!cuetMail.test(mail)) {
      alert("Only CUET email allowed.");
      return;
    }

    if (
      ans1.trim().toLowerCase() === qna.a1.toLowerCase() &&
      ans2.trim().toLowerCase() === qna.a2.toLowerCase() &&
      (!qna.a3 || ans3.trim().toLowerCase() === qna.a3.toLowerCase())
    ) {
      await api.post("/api/requests", {
        id: Date.now().toString(),
        iId: id,
        mail: mail
      });

      setFounderMail(item.mail);
    } else {
      alert("Wrong answers.");
    }
  };

  if (!qna || !item) return null;

  return (
    <>
      <Header />

      <div className="container section confirm-container">

        {/* HEADER */}
        <div className="glass confirm-header">
          <h1>Ownership Verification</h1>
          <p className="confirm-subtitle">
            Answer security questions to access finder contact
          </p>
        </div>

        {/* ITEM SUMMARY */}
        <div className="glass confirm-item-box">
          <h3>Item Info</h3>
          <p><b>Item:</b> {item.itemName}</p>
          <p><b>Location:</b> {item.loc}</p>
          <p><b>Date:</b> {item.date}</p>
          <p><b>Notes:</b> {item.notes}</p>
        </div>

        {/* VERIFICATION FORM */}
        <div className="glass confirm-form">

          <h3 className="mb-10">Verification Form</h3>

          <input
            placeholder="Your CUET Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />

          <div className="confirm-qbox">
            <p><b>{qna.q1}</b></p>
            <input value={ans1} onChange={(e) => setAns1(e.target.value)} />
          </div>

          <div className="confirm-qbox">
            <p><b>{qna.q2}</b></p>
            <input value={ans2} onChange={(e) => setAns2(e.target.value)} />
          </div>

          {qna.q3 && (
            <div className="confirm-qbox">
              <p><b>{qna.q3}</b></p>
              <input value={ans3} onChange={(e) => setAns3(e.target.value)} />
            </div>
          )}

          <div className="confirm-btn-box">
            <button className="btn-primary" onClick={handleSubmit}>
              Verify Identity
            </button>
          </div>
        </div>

        {/* RESULT */}
        {founderMail && (
          <div className="glass confirm-result">
            <h2>Verification Successful 🎉</h2>
            <p className="confirm-subtitle">Finder Contact Email:</p>
            <h3 className="confirm-mail">{founderMail}</h3>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
