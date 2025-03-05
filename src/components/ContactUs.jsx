// src/pages/ContactUs.jsx
import React from "react";
import Header from "./Header";

const ContactUs = () => {
  return (
    <>
      <Header />
      <div className="contact-container">
        <h2>Bizimle İletişime Geçin</h2>
        <p className="intro">
          Giyiyorum olarak, moda ve tasarım dünyasında sizlere en iyi hizmeti sunmayı amaçlıyoruz. Herhangi bir sorunuz, öneriniz veya işbirliği talebiniz varsa, bizimle iletişime geçmekten çekinmeyin.
        </p>
        <p>
          Bizimle aşağıdaki yöntemlerle iletişime geçebilirsiniz:
        </p>
        <div className="contact-details">
          <p>
            <strong>Email Adresimiz:</strong> <a href="mailto:contact@giyiyorum.com">contact@giyiyorum.com</a>
          </p>
          <p>
            <strong>Telefon Numarası:</strong> +90 123 456 7890
          </p>
          <p>
            <strong>Adres:</strong> Giyiyorum, Moda ve Tasarım Merkezi, İstanbul, Türkiye
          </p>
        </div>
        <p>
          Giyiyorum'a katıldığınız ve ilginiz için teşekkür ederiz. Moda ve tasarım hakkında sorularınızı, geri bildirimlerinizi veya önerilerinizi bize gönderebilirsiniz. Yaratıcı projelerde işbirliği yapmak için de bizimle iletişime geçebilirsiniz.
        </p>
        <p>
          <strong>Bizimle iletişime geçin ve birlikte moda dünyasında iz bırakmaya başlayalım!</strong>
        </p>
      </div>
    </>
  );
};

export default ContactUs;
