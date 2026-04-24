// PostItem.jsx
import { useState } from "react";
import axios from "axios";
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

  const [itemId, setItemId] = useState("");

  const cuetMail = /^u\d+@student\.cuet\.ac\.bd$/i;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const makeId = () => {
    return "CUET-" + Math.floor(10000 + Math.random() * 90000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cuetMail.test(form.mail)) {
      alert("Only CUET student email allowed.");
      return;
    }

    const newId = makeId();

    await axios.post("/api/items", {
      id: newId,
      itemName: form.itemName,
      loc: form.loc,
      date: form.date,
      mail: form.mail,
      notes: form.notes,
      status: "active"
    });

    await axios.post("/api/qna", {
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
    alert("Item posted successfully.");
  };

  return (
    <>
      <Header />

      <div className="container section post-container">

        {/* PAGE TITLE */}
        <div className="glass post-title">
          <h1>Found Something?</h1>
          <p className="post-subtitle">
            Fill in item details and security questions
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="glass post-form">

          {/* BASIC INFO */}
          <h3 className="mb-10">Item Details</h3>

          <input name="itemName" placeholder="Item Name" onChange={handleChange} required />
          <input name="loc" placeholder="Found Location" onChange={handleChange} required />
          <input type="date" name="date" onChange={handleChange} required />
          <input name="mail" placeholder="CUET Email (uXXXX@student.cuet.ac.bd)" onChange={handleChange} required />
          <textarea name="notes" placeholder="Notes (optional)" onChange={handleChange} />

          {/* SECURITY */}
          <h3 className="mt-20">Security Questions</h3>

          <input name="q1" placeholder="Question 1" onChange={handleChange} required />
          <input name="a1" placeholder="Answer 1" onChange={handleChange} required />

          <input name="q2" placeholder="Question 2" onChange={handleChange} required />
          <input name="a2" placeholder="Answer 2" onChange={handleChange} required />

          <input name="q3" placeholder="Question 3 (optional)" onChange={handleChange} />
          <input name="a3" placeholder="Answer 3 (optional)" onChange={handleChange} />

          {/* SUBMIT */}
          <div className="submit-box">
            <button className="btn-primary" type="submit">
              Submit Post
            </button>
          </div>
        </form>

        {/* ITEM ID DISPLAY */}
        {itemId && (
          <div className="glass success-box">
            <h2>Item Successfully Posted 🎉</h2>

            <p className="post-subtitle">Your Item ID:</p>

            <h1 className="item-id">{itemId}</h1>

            <p className="small-text">
              Save this ID to track or manage your item later
            </p>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}