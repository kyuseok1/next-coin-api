import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

type NewsArticle = {
  title: string;
  url: string;
  description: string;
  author: string | null;
  updated_at: number;
  news_site: string;
  thumb_2x: string | null; // 이미지가 없을 경우를 대비해 null 허용
};

const NewsSection = () => {
  const { t } = useTranslation();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetchCryptoNews = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/news"
        );

        if (Array.isArray(response.data.data)) {
          const articles: NewsArticle[] = response.data.data.map(
            (article: any) => ({
              title: article.title,
              url: article.url,
              description: article.description,
              author: article.author,
              updated_at: article.updated_at,
              news_site: article.news_site,
              thumb_2x: article.thumb_2x || null,
            })
          );

          setNewsArticles(articles);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching crypto news:", error);
      }
    };

    fetchCryptoNews();
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">{t("Latest Crypto News")}</h2>{" "}
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
              <h3 className="text-base font-medium">{article.title}</h3>{" "}
              <p className="text-xs">{article.description}</p>{" "}
              <p className="text-xs text-gray-500">{`${
                article.news_site
              } - ${new Date(
                article.updated_at * 1000
              ).toLocaleDateString()}`}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsSection;
