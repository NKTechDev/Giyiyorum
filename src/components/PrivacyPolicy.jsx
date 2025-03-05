// src/pages/PrivacyPolicy.jsx
import React from "react";
import Header from "./Header";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="privacy-container">
        <h2>Gizlilik Politikası</h2>
        <p className="intro">
          Giyiyorum.com olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu gizlilik politikası, kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
        </p>

        <h3>1. Topladığımız Bilgiler</h3>
        <p>
          Web sitemizi ziyaret ettiğinizde, kimlik bilgilerinizi (isim, e-posta adresi, telefon numarası vb.) ve kullanım bilgilerinizi (ziyaret ettiğiniz sayfalar, cihaz bilgileriniz, IP adresi vb.) toplayabiliriz.
        </p>

        <h3>2. Bilgileri Nasıl Kullanıyoruz?</h3>
        <p>
          Topladığımız bilgileri, hizmetlerimizi iyileştirmek, kullanıcı deneyimini kişiselleştirmek ve size özel teklifler sunmak amacıyla kullanıyoruz. Ayrıca, kullanıcılarımızla iletişime geçmek ve onlara önemli bilgileri bildirmek için bu bilgileri kullanabiliriz.
        </p>

        <h3>3. Bilgilerinizi Kimlerle Paylaşıyoruz?</h3>
        <p>
          Kişisel bilgilerinizi, üçüncü şahıslarla yalnızca yasal zorunluluklar veya hizmet sağlayıcılarımızın talepleri doğrultusunda paylaşırız. Herhangi bir durumda kişisel bilgilerinizi satmayız veya kiralamayız.
        </p>

        <h3>4. Çerezler (Cookies)</h3>
        <p>
          Web sitemizi daha iyi bir deneyim sunabilmek için çerezler kullanıyoruz. Çerezler, kullanıcı tercihlerini hatırlamaya ve sayfa yüklenme hızını artırmaya yardımcı olur. Çerezleri istemiyorsanız, tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.
        </p>

        <h3>5. Bilgilerinizi Nasıl Koruyoruz?</h3>
        <p>
          Kişisel bilgilerinizi korumak için endüstri standartlarında güvenlik önlemleri alıyoruz. Ancak, internet üzerinden yapılan veri iletimlerinin %100 güvenli olduğunu garanti edemeyiz. Her durumda, bilgilerinizin korunması için elimizden gelenin en iyisini yapıyoruz.
        </p>

        <h3>6. Kullanıcı Hakları</h3>
        <p>
          Kişisel verilerinizin doğruluğunu kontrol etme, erişim sağlama, düzeltme veya silme hakkınız bulunmaktadır. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
        </p>

        <h3>7. Politika Değişiklikleri</h3>
        <p>
          Bu Gizlilik Politikası zaman zaman güncellenebilir. Yapılan değişiklikler, bu sayfada yayınlandığı tarihten itibaren geçerli olacaktır. Bu politikayı düzenli olarak gözden geçirmenizi öneririz.
        </p>

        <h3>8. İletişim</h3>
        <p>
          Gizlilik politikamız hakkında sorularınız varsa, bizimle şu adresten iletişime geçebilirsiniz: <a href="mailto:contact@giyiyorum.com">contact@giyiyorum.com</a>
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
