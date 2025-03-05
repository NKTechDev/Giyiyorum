// src/pages/TermsOfService.jsx
import React from "react";
import Header from "./Header";

const TermsOfService = () => {
  return (
    <>
    <Header/>
    <div className="terms-container">
      <h2>Hizmet Şartları</h2>
      <p className="intro">
        Bu hizmet şartları, Giyiyorum.com platformunun kullanımını ve sunduğumuz hizmetleri düzenler. Platformumuzu kullanarak, aşağıdaki şartları kabul etmiş olursunuz.
      </p>

      <h3>1. Hizmetin Kullanımı</h3>
      <p>
        Giyiyorum.com, moda ve tasarım videoları, stil önerileri ve yaratıcı içerikler sunan bir platformdur. Bu platformu, yalnızca yasal ve doğru amaçlarla kullanabilirsiniz. Kullanıcılar, içeriklere yalnızca kişisel ve ticari olmayan amaçlarla erişebilirler.
      </p>

      <h3>2. Kullanıcı Hesapları</h3>
      <p>
        Platformumuzda bir hesap oluşturduğunuzda, kişisel bilgilerinizi doğru ve eksiksiz girmeyi kabul edersiniz. Hesap güvenliğinizden tamamen siz sorumlusunuz. Hesabınızın kötüye kullanımına karşı tedbirler almanız gerekmektedir.
      </p>

      <h3>3. İçerik</h3>
      <p>
        Giyiyorum.com üzerinde paylaşılan içerikler, fikri mülkiyet haklarıyla korunmaktadır. Kullanıcılar, içerikleri yalnızca platformda belirtilen kurallara uygun şekilde kullanabilir. İçeriğin izinsiz çoğaltılması, dağıtılması veya satılması yasaktır.
      </p>

      <h3>4. Yükümlülükler ve Sorumluluk</h3>
      <p>
        Giyiyorum.com, platformdaki tüm içeriklerin doğruluğu veya geçerliliği konusunda herhangi bir garanti vermez. Ayrıca, siteyi kullanırken ortaya çıkabilecek herhangi bir zarar veya kayıptan sorumlu değildir.
      </p>

      <h3>5. Gizlilik Politikası</h3>
      <p>
        Kişisel bilgilerinizin nasıl toplandığı, saklandığı ve kullanıldığı konusunda daha fazla bilgi için Gizlilik Politikamıza göz atabilirsiniz. Bu şartlar, Gizlilik Politikası ile birlikte geçerlidir.
      </p>

      <h3>6. Değişiklikler</h3>
      <p>
        Giyiyorum.com, bu hizmet şartlarını zaman zaman güncelleyebilir. Şartlardaki herhangi bir değişiklik, platformda yayınlandığı tarihten itibaren geçerli olacaktır. Kullanıcılar, şartları düzenli olarak kontrol etmekle yükümlüdür.
      </p>

      <h3>7. İletişim</h3>
      <p>
        Bu şartlar hakkında sorularınız varsa, lütfen bizimle iletişime geçin: <a href="mailto:contact@giyiyorum.com">contact@giyiyorum.com</a>
      </p>
    </div>
    </>
  );
};

export default TermsOfService;
