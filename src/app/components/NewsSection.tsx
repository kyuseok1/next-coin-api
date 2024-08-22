import React from "react";
import { useTranslation } from "react-i18next";

type NewsArticle = {
  title: string;
  url: string;
};

type NewsSectionProps = {
  news: NewsArticle[];
};

const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      {/* <h2 className="text-2xl font-bold mb-2">{t("Latest News")}</h2> */}
      <ul>
        {news.map((article, index) => (
          <li key={index} className="mb-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsSection;
