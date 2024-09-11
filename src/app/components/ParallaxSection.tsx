import { Parallax } from "react-parallax";
import { useTranslation } from "react-i18next";

const ParallaxSection = () => {
  const { t } = useTranslation();

  return (
    <Parallax
      className="parallax"
      bgImage="/images/home3.png"
      strength={700}
      style={{ width: "100%", height: "100%" }}
    >
      <div className="relative" style={{ width: "100%", height: "100%" }}>
        {" "}
        <section className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-black bg-opacity-60 h-full w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("코인의 모든것")}
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 leading-relaxed">
            {t(" 쉽고 간편하게")}
          </p>
        </section>
      </div>
    </Parallax>
  );
};

export default ParallaxSection;
