// src/pages/AboutUs.jsx
import React from "react";
import Header from "./Header";

const AboutUs = () => {
  return (
    <>
      <Header />
      <div className="about-container">
        <div className="about-header">
          <h2>Hakkımızda</h2>
          <p className="tagline">Giyiyorum'a Hoşgeldiniz - Moda ve Tasarımın Kalbi</p>
        </div>
        <div className="about-content">
          <p>
            Giyiyorum, modanın ve tasarımın en heyecan verici dünyasına adım atmanızı sağlayan bir platformdur. Moda ve tasarım dünyasındaki en yeni trendleri takip ederken, aynı zamanda yaratıcı içerik ve videolarla ilham veren bir deneyim sunuyoruz.
          </p>
          <p>
            Amacımız, sadece moda ve tasarım ürünleri sunmak değil; aynı zamanda kullanıcılarımıza, stil ve yaratıcılık açısından kendi sınırlarını zorlayabilecekleri bir alan yaratmaktır. Giyiyorum, her zevke ve tarza hitap eden içeriklerle, herkesin kendini özgürce ifade edebileceği bir ortam sağlamayı hedefler.
          </p>
          <p>
            Web sitemizdeki içerikler arasında, stil ipuçları, tasarım önerileri, moda haberleri ve profesyonel tasarım videoları gibi bir dizi video ve yazılı içerik bulunmaktadır. Giyiyorum, aynı zamanda moda tasarımcıları, stilistler ve içerik üreticileriyle işbirliği yaparak, en kaliteli içerikleri sizlere sunar.
          </p>
          <p>
            Bizimle birlikte, stilin ve tasarımın her yönünü keşfedin. Giyiyorum, sadece bir platform değil; yaratıcılığınızı ifade etmenin, modaya dair en yeni fikirleri ve trendleri keşfetmenin adresi.
          </p>
          <p>
            Giyiyorum olarak, sizlere şıklığı, zarafeti ve özgürlüğü sunmayı amaçlıyoruz. Her gün yeni ve özgün içerikler ile sizlere ilham veriyoruz ve moda dünyasında kendinizi ifade etmeniz için size yol gösteriyoruz.
          </p>
          <p>
            Bizimle büyüyün, yeni trendlere adım atın ve stilinizi bir adım öteye taşıyın. Giyiyorum, sadece bir moda platformu değil; tasarımın kalbinde yer alan, yaratıcı içeriklerle dolu bir dünyadır.
          </p>
        </div>
        <div className="about-footer">
          <p>Giyiyorum’a katıldığınız için teşekkür ederiz. Birlikte unutulmaz bir iz bırakacağımıza inanıyoruz.</p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
