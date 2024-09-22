# 코인 정보 사이트

이 프로젝트는 Next.js로 구축된 암호화폐 정보 대시보드입니다. 가격 알림, 정렬, 필터링 등 다양한 암호화폐에 대한 자세한 정보를 제공합니다. 아래에는 주요 기능, 사용 방법, 각 기능을 구축하는 데 사용된 기술 스택에 대한 세부 정보가 있습니다.

<br>
<br>


## 🚀 Demo 링크
https://next-coin-api.vercel.app/ <br><br>

## 🕰️ 제작 기간 
- **제작 기간**: 2024년 7월 28일 ~

  <br><br>
## 🛠️ 기술 스택

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br><br>

## 📈 Dependency  Version

| Dependency                | Version  |
| ------------------------- | -------- |
| axios                     | ^1.7.2   |
| chart.js                  | ^4.4.3   |
| express                   | ^4.19.2  |
| i18next                   | ^23.12.2 |
| next                      | 14.2.5   |
| next-i18next              | ^15.3.1  |
| react                     | ^18      |
| @types/node              | ^20      |
| @types/react             | ^18      |
| @types/react-dom         | ^18      |
| @types/ws                | ^8.5.12  |
| autoprefixer             | ^10.4.19 |
| postcss                  | ^8.4.40  |
| tailwindcss              | ^3.4.7   |
| typescript               | ^5       |


<br>
<br>



## 🛠️ Features 

<img width="1268" alt="홈페이지" src="https://github.com/user-attachments/assets/9b73e2eb-6f10-4c05-b715-557e8ffa7a90">

## 1. 다크모드 토글
- 설명: 더 나은 시청 환경을 위해 밝은 모드와 어두운 모드를 전환합니다.
- 사용법: "라이트 모드" 또는 "다크 모드"라고 표시된 버튼을 클릭하여 모드를 전환합니다.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 다크 모드 상태 관리.
  - `Tailwind CSS`: 다크 모드와 라이트 모드에 따라 다른 스타일 적용.
 

## 2. 언어 선택
- 설명: 애플리케이션의 언어를 변경합니다.
- 사용법: 드롭다운 메뉴를 사용해 "영어" 또는 "한국어"를 선택하세요.
- 기술스택:
  - `i18next`: 다국어 지원을 위해 사용.
  - `react-i18next`: React 컴포넌트와의 통합을 위해 사용.
    
## 3. 코인 찾기
- 설명: ID로 특정 암호화폐를 검색합니다.
- 사용법: 입력란에 코인 ID를 입력하고 "검색"을 클릭하세요.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 검색 입력 및 결과 상태 관리.
  - `Fetch API`: 특정 코인 데이터를 검색하기 위해 사용.

## 4. 가격 알림 설정
- 설명: 암호화폐가 특정 가격에 도달하면 알림을 설정합니다.
- 사용법: "가격 알림 설정" 버튼을 클릭하고 원하는 가격을 입력합니다. 알림은 "가격 알림" 섹션에서 보고 삭제할 수 있습니다.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 알림 상태 관리.
  - `Browser Notifications API`: 가격 알림을 사용자에게 전달.
   
 ## 5. 코인 분류
- 설명: 시가총액 또는 가격별로 암호화폐를 정렬합니다.
- 사용법: 드롭다운 메뉴를 사용하여 "시가총액" 또는 "가격"으로 정렬을 선택하세요.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 정렬 상태 관리.
 
 ## 6. 코인 보기 및 즐겨찾기
- 설명: 각 코인에 대한 자세한 정보를 보고 즐겨찾기에 추가합니다.
- 사용법:
  - 코을 클릭하면 자세한 정보를 볼 수 있습니다.
  - 코인 카드의 별표 아이콘을 클릭하면 해당 코인 카드를 즐겨찾기에 추가하거나 즐겨찾기에서 제거할 수 있습니다.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 즐겨찾기 상태 관리.
  - `Next.js Link`: 코인 상세 페이지로 이동하기 위해 사용.

 ## 9. 더 많은코인 불러오기
- 설명: 코인 목록을 볼 때 더 많은 코인을 불러옵니다.
- 사용법: 페이지네이션을 이용
- 기술스택:
  - `React Hooks`: `useState`와 `useEffect`를 사용하여 페이지 상태 및 코인 데이터 관리.
  - `Fetch API`: 더 많은 코인 데이터를 불러오기 위해 사용.

 ## 10. 알림 필터링
- 설명: 모든 코인이나 특정 코인에 대한 알림을 표시하기 위해 알림을 필터링합니다.
- 사용법:"가격 알림" 섹션의 드롭다운 메뉴를 사용하여 "모든 알림" 또는 특정 코인을 선택하세요.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 알림 필터 상태 관리.

<br><br>
## 트러블 슈팅 문제 해결

## 1. CoinList 컴포넌트 중복 코인 

### 문제 설명
`CoinList` 컴포넌트를 개발하는 동안 동일한 코인이 리스트에 중복으로 렌더링되는 문제가 발생했습니다. 이 섹션은 문제 해결 과정을 문서화한 것입니다.

### 초기 관찰
컴포넌트가 동일한 코인의 항목을 중복으로 렌더링하고 있었습니다. 이는 예상치 못한 동작이었고, 깨끗하고 사용자 친화적인 인터페이스를 보장하기 위해 해결해야 했습니다.

### 문제 식별 및 해결 과정

1. **코인 데이터 로깅**:
    - 먼저, `CoinList` 컴포넌트에서 받은 `coins` 배열을 확인하기 위해 로깅을 추가했습니다. 이를 통해 API 응답에서 중복이 발생하는지, 컴포넌트 내에서 중복이 발생하는지를 확인했습니다.
    ```typescript
    useEffect(() => {
      console.log("Coins data:", coins);
    }, [coins]);
    ```

2. **코인 정렬**:
    - 선택한 정렬 기준(`market_cap` 또는 `price`)에 따라 코인을 정렬했습니다. 이 단계는 추가 처리를 하기 전에 코인의 일관된 순서를 보장합니다.
    ```typescript
    const sortedCoins = [...coins].sort((a, b) => {
      if (sortBy === "market_cap") {
        return (b.market_data?.market_cap?.usd || 0) - (a.market_data?.market_cap?.usd || 0);
      } else if (sortBy === "price") {
        return (b.market_data?.current_price?.usd || 0) - (a.market_data?.current_price?.usd || 0);
      }
      return 0;
    });
    ```

3. **중복 코인 제거**:
    - `coin.id`를 기준으로 중복 항목을 제거하여 고유한 항목을 포함하는 새로운 배열 `uniqueCoins`를 생성했습니다. 이를 위해 `Set`과 `map` 메서드를 사용했습니다.
    ```typescript
    const uniqueCoins = Array.from(new Set(sortedCoins.map((coin) => coin.id)))
      .map((id) => sortedCoins.find((coin) => coin.id === id))
      .filter((coin): coin is Coin => coin !== undefined);
    ```

4. **코인 필터링**:
    - 사용자의 입력(`filterText`, `filterType`, `priceRange`)에 따라 추가 필터를 적용했습니다.
    ```typescript
    const filteredCoins = uniqueCoins.filter((coin) => {
      const matchesFilterText = coin.name.toLowerCase().includes(filterText.toLowerCase());
      const matchesFilterType = filterType === "all" || coin.type === filterType;
      const matchesPriceRange = 
        (coin.market_data?.current_price?.usd || 0) >= priceRange[0] &&
        (coin.market_data?.current_price?.usd || 0) <= priceRange[1];
      return matchesFilterText && matchesFilterType && matchesPriceRange;
    });
    ```

5. **코인 렌더링**:
    - 마지막으로, 각 코인이 고유한 키와 올바른 데이터를 갖도록 하여 필터링된 고유 코인 리스트를 렌더링했습니다.
    ```typescript
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoins.map((coin) => (
          <div key={coin.id} className="relative">
            <Link href={`/coin/${coin.id}`} passHref>
              <div
                className={`cursor-pointer p-4 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <CoinInfo coin={coin} />
                <p className="mt-2 text-sm">
                  {t("24h Change")}: {coin.market_data?.price_change_percentage_24h?.toFixed(2)}%
                </p>
                {coin.prices && (
                  <div className="mt-4">
                    <CoinChart prices={coin.prices} period={chartPeriod} />
                  </div>
                )}
              </div>
            </Link>
            <button
              onClick={() => handleFavorite(coin.id)}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                favorites.includes(coin.id) ? "bg-yellow-500" : "bg-gray-300"
              }`}
            >
              ★
            </button>
          </div>
        ))}
      </div>
    );
    ```

### 느낀점
이러한 단계를 구현함으로써 중복 코인 항목 문제를 성공적으로 해결했습니다. 핵심은 필터와 렌더링을 적용하기 전에 고유한 항목을 보장하는 것이었습니다. 이 접근 방식은 암호화폐 데이터를 깨끗하고 효율적이며 사용자 친화적으로 표현할 수 있도록 합니다.



<br><br><br><br><br><br>

## 2. Npm Run build시 에러

## 문제 설명
로컬에선 정상 작동했지만 npm run build시 Type 'OmitWithTag<typeof import("C:/Users/\uADDC\uC11D/coin-api-site/src/app/api/coin/route"), "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "DELETE" | "PATCH" | "config" | "generateStaticParams" | "revalidate" | ... 5 more ... | "maxDuration", "">' does not satisfy the constraint '{ [x: string]: never; }'. 에러가 뜸

## 문제 원인
GET은 HTTP 메서드( HEAD, POST, PUT,  등) 만 내보낼 수 있기 때문입니다 . 지원되지 않는 메서드가 호출되면 Next.js는 오류를 반환합니다

## 문제 식별 및 해결 과정
유틸 파일 따로 생성
src/app/utils/coinApi.ts파일을 만들어 API 호출 관련 로직들을 한 곳에 모았습니다. 이 파일에는 코인 데이터를 가져오는 함수, 중복 제거, 필터링 등의 복잡한 로직을 포함시킬 수 있습니다.

```typescript

import axios from "axios";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// 예시: 코인 데이터를 가져오는 유틸리티 함수
export const getTopCoins = async (vs_currency: string = "usd", per_page: number = 100) => {
  const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
    params: { vs_currency, order: "market_cap_desc", per_page, page: 1 },
  });
  return response.data;
};

// 추가로 다른 API 관련 함수들 작성 가능
```
## 느낀점
이 문제를 해결하면서, API 라우트 파일에서 단일 책임 원칙을 적용하는 것이 얼마나 중요한지 깨달았습니다. API 라우트 파일은 HTTP 메서드 처리에 집중하고, 데이터 처리나 복잡한 로직은 유틸리티 파일로 분리하는 것이 코드의 유지보수성과 가독성을 크게 향상시킬 수 있었습니다. 또한, 타입스크립트를 사용하는 프로젝트에서 타입 오류를 미리 확인하고 해결하는 것이 안정적인 배포를 위해 필수적이라는 점을 다시 한번 깨달았습니다.
<br><br><br><br><br><br>

## 2. Cors 에러 발생

## 문제 설명
"https://api.coingecko.com/api/v3" 라는 무료 api를 사용중에 Cors 에러가 발생.

## 문제 원인
 CORS는 한 출처에서 로드된 웹 페이지가 다른 출처에 요청을 보낼 때 보안상의 이유로 발생하는 문제입니다. 예를 들어, 브라우저에서 https://example.com에서 https://api.example2.com으로 데이터를 요청할 때 CORS 정책에 의해 브라우저에서 요청을 차단할 수 있습니다. 서버가 해당 요청을 허용하지 않는다면 CORS 에러가 발생합니다.

## 문제 식별 및 해결 과정
1. fetchApi 함수 사용: CORS 에러를 피하기 위해, 클라이언트 측에서 외부 API로 직접 요청하는 대신, Next.js의 API 경로 (/api/coin)를 사용하여 백엔드 서버에서 외부 API 요청을 처리하도록 설계했습니다. Next.js의 API 라우트를 통해 서버 측에서 외부 API로 요청을 보내면, CORS 에러가 발생하지 않습니다.

```
typescript
코드 복사
const fetchApi = async (path: string) => {
  const response = await fetch(`/api/coin${path}`);
  if (!response.ok) {
    throw new Error("API 요청에 실패했습니다.");
  }
  return response.json();
};
여기서 /api/coin은 Next.js의 API 경로로, 이 경로에서 서버 측으로 요청이 전달됩니다. 서버 측에서는 외부의 CoinGecko API로 요청을 보내고, 그 결과를 클라이언트로 반환합니다.
```
2. 프론트엔드 클라이언트 요청 구조: 프론트엔드에서는 fetchApi를 통해 /api/coin을 요청하면, 서버 측에서 CoinGecko API와 같은 외부 서비스에 요청을 보내고, 결과를 클라이언트로 반환합니다. 이 과정에서 외부 API와 직접 통신하는 것이 아니라, 서버를 통해 데이터를 받아오는 구조이기 때문에 CORS 에러를 피할 수 있습니다.

## 느낀잠
이번 CORS 문제를 해결하는 과정을 통해 클라이언트와 서버 간의 통신 구조에 대한 이해를 더욱 깊이 있게 다질 수 있었습니다. 특히 클라이언트 측에서 발생하는 CORS 에러는 보안상의 이유로 발생하는 일반적인 문제이지만, 이를 해결하는 방법이 다양하다는 것을 다시 한번 깨달았습니다.

<br><br><br><br><br><br>









