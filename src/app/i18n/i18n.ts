import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Crypto Coin Information": "Crypto Coin Information",
      "Light Mode": "Light Mode",
      "Dark Mode": "Dark Mode",
      "Enter coin ID (e.g., bitcoin)": "Enter coin ID (e.g., bitcoin)",
      "Subscribe to Alerts": "Subscribe to Alerts",
      "Enter your email": "Enter your email",
      Search: "Search",
      "Set Price Alert": "Set Price Alert",
      "Clear Alerts": "Clear Alerts",
      "Sort by Market Cap": "Sort by Market Cap",
      "Sort by Price": "Sort by Price",
      "Filter coins by name": "Filter coins by name",
      "All Alerts": "All Alerts",
      "1 Day": "1 Day",
      "1 Week": "1 Week",
      "1 Month": "1 Month",
      "Price Alerts": "Price Alerts",
      Delete: "Delete",
      "Recent Searches": "Recent Searches",
      "Favorite Coins": "Favorite Coins",
      "24h Change": "24h Change",
      "Load More": "Load More",
      Login: "Login",
      Logout: "Logout",
      "Global alert for": "Global alert for",
      "Alert for": "Alert for",
      at: "at",
    },
  },
  ko: {
    translation: {
      "Crypto Coin Information": "암호화폐 정보",
      "Light Mode": "라이트 모드",
      "Dark Mode": "다크 모드",
      "Enter coin ID (e.g., bitcoin)": "코인 ID 입력 (예: bitcoin)",
      "Subscribe to Alerts": "알림구독",
      "Enter your email": "이메일을 입력하세요.",
      "All Types": "모든 코인",
      "Trending Coins": "트렌드 코인",
      Search: "검색",
      "Set Price Alert": "가격 알림 설정",
      "Clear Alerts": "알림 지우기",
      "Sort by Market Cap": "시가 총액 순",
      "Sort by Price": "가격 순",
      "Filter coins by name": "이름으로 코인 필터링",
      "All Alerts": "모든 알림",
      "1 Day": "1일",
      "1 Week": "1주",
      "1 Month": "1개월",
      "Price Alerts": "가격 알림",
      Delete: "삭제",
      "Recent Searches": "최근 검색",
      "Favorite Coins": "즐겨찾는 코인",
      "24h Change": "24시간 변동",
      "Load More": "더 보기",
      Login: "로그인",
      Logout: "로그아웃",
      "Global alert for": "전체 알림",
      "Alert for": "알림",
      at: "에서",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // 초기 언어 설정
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
