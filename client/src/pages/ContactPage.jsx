import React, { useState } from "react";
import "./ContactPage.css";

const ContactPage = () => {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("📨 Merci pour votre message ! Nous vous répondrons bientôt.");
    setForm({ nom: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <h2>📬 Contactez-nous</h2>
      <p className="intro">
        Une question, une suggestion ou un problème ?  
        Le développeur de <strong>Prodify-dz</strong> est à votre écoute.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          placeholder="Votre nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Votre email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Votre message..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default ContactPage;
