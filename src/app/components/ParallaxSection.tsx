import { Parallax } from "react-parallax";
import { useTranslation } from "react-i18next";

const ParallaxSection = () => {
  const { t } = useTranslation();

  return (
    <Parallax className="parallax" bgImage="/images/home3.png" strength={700}>
      <div className="relative">
        <section className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-black bg-opacity-60 h-screen">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("코인의 모든것")}
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 leading-relaxed">
            {t("커뮤니티에서 쉽고 간편하게")}
          </p>
        </section>
        <section className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-black bg-opacity-60 h-screen">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("코인 정보를 한곳에서 보고 ")}
          </h1>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("한 곳에서 관리하세요.")}
          </h1>
          <h1 className="text-lg md:text-2xl text-gray-300 leading-relaxed">
            {t("이제껏 경험 못했던 편리한 서비스")}
          </h1>
          <h1 className="text-lg md:text-2xl text-gray-300 leading-relaxed">
            {t("커뮤니티와 함께라면 새로워질 거에요.")}
          </h1>
        </section>
        <section className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-black bg-opacity-60 h-screen">
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
            {t("찾으시는 정보가 있으신가요?")}
          </p>
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
            {t("누구나 쉽게 찾을수 있답니다.")}
          </p>
        </section>
      </div>
    </Parallax>
  );
};

export default ParallaxSection;
