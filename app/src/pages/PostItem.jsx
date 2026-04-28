import { useState, useEffect } from "react";
import api from "../api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "./PostItem.css";

export function PostItem() {
  const [form, setForm] = useState({
    itemName: "",
    loc: "",
    date: "",
    mail: "",
    notes: "",
    q1: "",
    a1: "",
    q2: "",
    a2: "",
    q3: "",
    a3: ""
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [itemId, setItemId] = useState("");

  const cuetMail =
    /^[a-z0-9._%+-]+@(student\.cuet\.ac\.bd|cuet\.ac\.bd)$/i;

  useEffect(() => {
    if (cooldown <= 0) return;

    const t = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [cooldown]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!cuetMail.test(form.mail)) {
      alert("Invalid CUET email");
      return;
    }

    await api.post("/api/otp/send", {
      mail: form.mail,
      purpose: "post"
    });

    setOtpSent(true);
    setCooldown(15);
  };

  const verifyOtp = async () => {
    const res = await api.post("/api/otp/verify", {
      mail: form.mail,
      otp,
      purpose: "post"
    });

    if (res.data.verified) {
      setVerified(true);
      alert("Email verified");
    } else {
      alert("Invalid OTP");
    }
  };

  const makeId = () =>
    "CUET-" + Math.floor(10000 + Math.random() * 90000);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verified) {
      alert("Verify email first");
      return;
    }

    const newId = makeId();

    await api.post("/api/items", {
      id: newId,
      itemName: form.itemName,
      loc: form.loc,
      date: form.date,
      mail: form.mail,
      notes: form.notes,
      status: "active"
    });

    await api.post("/api/qna", {
      id: Date.now().toString(),
      iId: newId,
      q1: form.q1,
      a1: form.a1,
      q2: form.q2,
      a2: form.a2,
      q3: form.q3,
      a3: form.a3
    });

    setItemId(newId);
    alert("Post successful. Finder will be notified via email.");
  };

  return (
    <>
      <Header />

      <div className="container section">

        <h1>Post Found Item</h1>

        {/* STEP 1: OTP */}
        {!verified && (
          <div className="glass">

            <h2>Verify Your Email Before Making A Post</h2>

            <input
              name="mail"
              placeholder="CUET Email"
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={sendOtp}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Wait ${cooldown}s` : "Send OTP"}
            </button>

            {otpSent && (
              <>
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button type="button" onClick={verifyOtp}>
                  Verify OTP
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 2: FORM */}
        {verified && (
          <form onSubmit={handleSubmit} className="glass">

            <input name="itemName" placeholder="Item Name" onChange={handleChange} required />
            <input name="loc" placeholder="Location" onChange={handleChange} required />
            <input type="date" name="date" onChange={handleChange} required />
            <textarea name="notes" placeholder="Notes" onChange={handleChange} />

            <h3>Security Questions</h3>

            <input name="q1" placeholder="Q1" onChange={handleChange} required />
            <input name="a1" placeholder="A1" onChange={handleChange} required />

            <input name="q2" placeholder="Q2" onChange={handleChange} required />
            <input name="a2" placeholder="A2" onChange={handleChange} required />

            <input name="q3" placeholder="Q3" onChange={handleChange} />
            <input name="a3" placeholder="A3" onChange={handleChange} />

            <button type="submit">Submit Post</button>

          </form>
        )}

        {itemId && (
          <div className="glass">
            <h2>Item Posted</h2>
            <h1>{itemId}</h1>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
