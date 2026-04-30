import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import api from "../api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function ConfirmItem() {
  const location = useLocation();
  const id = location.state?.itemId;

  const [item, setItem] = useState(null);
  const [qna, setQna] = useState(null);

  const [mail, setMail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [submitStatus, setSubmitStatus] = useState(null);

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

      setSubmitStatus("success");
      //alert("Request submitted. Finder + you will get email confirmation.");
    } else {
      setSubmitStatus("error");
      //alert("Wrong answers");
    }
  };

  if (!id) return <div>No item selected.</div>;
  if (!item || !qna) return <div>Loading...</div>;

  return (
    <>
      <Header />

      <div className="confirm-container">

        <h1>Prove Ownership</h1>

        {/* OTP STEP */}
        {!verified && (
          <div className="glass">
            <h2>Verify Your Email Before Submitting A Request</h2>
            <div className="mail-row">
              <input
                name="mail"
                placeholder="CUET Email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
              <button
                className="btn-primary"
                onClick={sendOtp}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Wait ${cooldown}s` : "Send OTP"}
              </button>
            </div>

            {otpSent && (
              <div className="mail-row">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button className="btn-primary" onClick={verifyOtp}>
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        )}

        {/* FORM STEP */}
        {verified && submitStatus === null && (
          <div className="glass">
            <div className="confirm-header">{item.itemName}</div>
            
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

            <button className="btn-primary" onClick={handleSubmit}>
              Submit Claim
            </button>

          </div>
        )}

        {submitStatus === "success" && (
          <div className="glass">
            <h2 style={{ color: "lightgreen" }}>
              ✔ Request Submitted Successfully
            </h2>
            <p>
              Finder + you will get email confirmation.
            </p>
          </div>
        )}
        
        {submitStatus === "error" && (
          <div className="glass">
            <h2 style={{ color: "#ff6b6b" }}>
              ✖ Wrong Answers
            </h2>
            <p>
              Your answers did not match. <b>Are you sure you are at the right spot?</b>
            </p>
        
            <button
              className="btn-primary"
              onClick={() => setSubmitStatus(null)}
            >
              Try Again
            </button>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
