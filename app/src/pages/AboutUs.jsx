// AboutUs.jsx
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "./AboutUs.css";

export function AboutUs() {
  return (
    <>
      <Header />

      <div className="page-wrapper section">

        {/* HERO */}
        <section className="container">
          <div className="glass about-hero">
            <h1>About CUET Lost & Found</h1>
            <p className="hero-text">
              A COMMUNITY SERVICE PLATFORM MADE BY CUETIANS FOR CUET
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="about-content">
          <div className="container">

            <div className="glass hover-card about-card">
              <h2>Our Mission</h2>
              <p>
                CUET Lost & Found helps students safely recover lost items
                through a verified finder-based system using CUET emails and
                secure question validation.
              </p>
            </div>

            <div className="glass hover-card about-card">
              <h2>How It Works</h2>
              <ul>
                <li>Finder posts found item with CUET email</li>
                <li>Owner searches and goes through Q&A</li>
                <li>Security questions verify ownership</li>
                <li>Contact between finder and owner is established</li>
                <li>Finder initiates handover after verification</li>
              </ul>
            </div>

            <div className="glass hover-card about-card">
              <h2>Why It's Secure</h2>
              <ul>
                <li>Only CUET student emails allowed</li>
                <li>Item ID based tracking system</li>
                <li>Question-based ownership verification</li>
              </ul>
            </div>

          </div>
        </section>

        {/* TEAM */}
        <section className="about-team">
          <div className="container">

            <div className="glass about-team-header">
              <h2>Team</h2>
              <p className="team-text">
                Meet The People Behind This Project
              </p>
            </div>

            <div className="team-section">

              <div className="team-member glass hover-card">
                <div className="avatar">👨‍💻</div>
                <h3>Md. Abdulla Al Nishat</h3>
              </div>

              <div className="team-member glass hover-card">
                <div className="avatar">👨‍💻</div>
                <h3>Md. Redwan Mahmud</h3>
              </div>

              <div className="team-member glass hover-card">
                <div className="avatar">👨‍💻</div>
                <h3>Khondoker Mubinul Islam Albab</h3>
              </div>

            </div>

          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}