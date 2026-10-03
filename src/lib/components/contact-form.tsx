"use client";
import { useState } from "react";
import { Arrow } from "./icons";
export default function ContactForm() {
  const [ready, setReady] = useState(false);
  return (
    <form
      className="contact-form"
      action="mailto:info@horizonaccountingservices.com"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const body = `Hi Lillian,\n\nMy name is ${f.get("name")}.\nBusiness: ${f.get("business") || "Not provided"}\nEmail: ${f.get("email")}\nI’m interested in: ${f.get("service")}\n\n${f.get("message")}\n`;
        window.location.href = `mailto:info@horizonaccountingservices.com?subject=${encodeURIComponent("Let’s work together — " + f.get("name"))}&body=${encodeURIComponent(body)}`;
        setReady(true);
      }}
    >
      <div className="form-row">
        <label>
          Your name
          <input
            name="name"
            placeholder="First and last name"
            autoComplete="name"
            required
            maxLength={120}
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            placeholder="you@yourbusiness.com"
            autoComplete="email"
            required
            maxLength={180}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Business name <span>(optional)</span>
          <input
            name="business"
            placeholder="Your business"
            autoComplete="organization"
            maxLength={180}
          />
        </label>
        <label>
          How can we help?
          <select name="service" defaultValue="Let’s figure it out together">
            <option>Let’s figure it out together</option>
            <option>New Business Formation</option>
            <option>Essential Bookkeeping</option>
            <option>Growth Package</option>
            <option>Fractional CFO</option>
          </select>
        </label>
      </div>
      <label>
        A little about what you need
        <textarea
          name="message"
          placeholder="Where are you now, and where would you like to go?"
          rows={3}
          required
          maxLength={4000}
        />
      </label>
      <div className="form-submit">
        <p>This opens your email app with your message ready to send.</p>
        <button className="button button-dark" type="submit">
          Start the conversation <Arrow diagonal />
        </button>
      </div>
      <p className="form-status" role="status">
        {ready
          ? "Your email draft is ready in your email app. Send it there to contact Lillian. If it didn’t open, email info@horizonaccountingservices.com directly."
          : ""}
      </p>
      <noscript>
        <p>
          You can also email{" "}
          <a href="mailto:info@horizonaccountingservices.com">
            info@horizonaccountingservices.com
          </a>{" "}
          directly.
        </p>
      </noscript>
    </form>
  );
}
