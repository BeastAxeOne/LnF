import { useEffect, useState } from "react";
import api from "../api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function ConfirmItem() {
  const id = sessionStorage.getItem("confirmItemId");

  const [item, setItem] = useState(null);
  const [qna, setQna] = useState(null);

  const [mail, setMail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [ans1, setAns1] = useState("");
  const [ans2, setAns2] = useState("");
  const [ans3, setAns3] = useState("");

  const cuetMail =
    /^[a-z0-9._%+-]+@(student\.cuet\.ac\.bd|cuet\.ac\.bd)$/i;

  useEffect(() => {
    const load = async () => {
      const itemRes = await api.get(`/api/items/${id}`);
      setItem(itemRes.data);

      const qRes = await api.get(`/api/qna?iId=${id}`);
      setQna(qRes.data[0]);
    };

    load();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;

    const t = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [cooldown]);

  const sendOtp = async () => {
    if (!cuetMail.test(mail)) {
      alert("Invalid CUET email");
      return;
    }

    await api.post("/api/otp/send", {
      mail,
      purpose: "confirm"
    });

    setOtpSent(true);
    setCooldown(15);
  };

  const verifyOtp = async () => {
    const res = await api.post("/api/otp/verify", {
      mail,
      otp,
      purpose: "confirm"
    });

    if (res.data.verified) {
      setVerified(true);
    } else {
      alert("Wrong OTP");
    }
  };

  const handleSubmit = async () => {
    if (!verified) return alert("Verify email first");

    if (
      ans1.toLowerCase() === qna.a1.toLowerCase() &&
      ans2.toLowerCase() === qna.a2.toLowerCase() &&
      (!qna.a3 || ans3.toLowerCase() === qna.a3.toLowerCase())
    ) {
      await api.post("/api/requests", {
        iId: id,
        mail
      });

      alert("Request submitted. Finder + you will get email confirmation.");
    } else {
      alert("Wrong answers");
    }
  };

  if (!item || !qna) return null;

  return (
    <>
      <Header />

      <div className="container section">

        <h1>Confirm Item</h1>

        <p>{item.itemName}</p>

        {/* OTP STEP */}
        {!verified && (
          <div className="glass">

            <input
              placeholder="CUET Email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
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
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button onClick={verifyOtp}>
                  Verify OTP
                </button>
              </>
            )}

          </div>
        )}

        {/* FORM STEP */}
        {verified && (
          <div className="glass">

            <h3>{qna.q1}</h3>
            <input onChange={(e) => setAns1(e.target.value)} />

            <h3>{qna.q2}</h3>
            <input onChange={(e) => setAns2(e.target.value)} />

            {qna.q3 && (
              <>
                <h3>{qna.q3}</h3>
                <input onChange={(e) => setAns3(e.target.value)} />
              </>
            )}

            <button onClick={handleSubmit}>
              Submit Claim
            </button>

          </div>
        )}

      </div>

      <Footer />
    </>
  );
}