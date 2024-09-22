import { useEffect, useState } from "react";
import { fetchCryptoNews } from "../../app/utils/coinApi";
import { useTranslation } from "react-i18next";

type NewsArticle = {
  title: string;
  url: string;
  description: string;
  author: string | null;
  updated_at: string;
  news_site: string;
  thumb_2x: string | null;
};

const NewsSection = () => {
  const { t } = useTranslation();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetchCryptoNews();
        const articlesArray = Array.isArray(response.data) ? response.data : [];
        setNewsArticles(articlesArray);
      } catch (error) {
        console.error("Error fetching crypto news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">{t("Latest Crypto News")}</h2>
      <ul>
        {newsArticles.slice(0, 2).map((article, index) => (
          <li key={index} className="mb-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {article.thumb_2x && (
                <img
                  src={article.thumb_2x}
                  alt={article.title}
                  className="mb-1 w-full h-48 object-cover"
                />
              )}
              <h3 className="text-base font-medium line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs line-clamp-3">{article.description}</p>
              <p className="text-xs text-gray-500">
                {`${article.news_site} - ${article.updated_at}`}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsSection;
