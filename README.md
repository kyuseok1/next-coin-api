# 코인 정보 사이트

이 프로젝트는 React와 Next.js로 구축된 암호화폐 정보 대시보드입니다. 가격 알림, 정렬, 필터링 등 다양한 암호화폐에 대한 자세한 정보를 제공합니다. 아래에는 주요 기능, 사용 방법, 각 기능을 구축하는 데 사용된 기술 스택에 대한 세부 정보가 있습니다.

<br>
<br>


## 🚀 Demo 링크
https://next-coin-api.vercel.app/ <br><br>

## 🕰️ 제작 기간 
- **제작 기간**: 2024년 7월 28일 ~ 계속 작업

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
   
## 5. 모든 알림 지우기
- 설명: 설정된 모든 가격 알림을 지웁니다.
- 사용법:"알림 지우기" 버튼을 클릭하세요.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 알림 상태 관리.
 
 ## 6. 코인 분류
- 설명: 시가총액 또는 가격별로 암호화폐를 정렬합니다.
- 사용법: 드롭다운 메뉴를 사용하여 "시가총액" 또는 "가격"으로 정렬을 선택하세요.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 정렬 상태 관리.
 
 ## 7. 코인 필러링
- 설명: 이름, 유형 또는 가격 범위별로 암호화폐 목록을 필터링합니다.
- 사용법:
  - 이름으로 필터링하려면 필터 입력란에 이름을 입력하세요.
  - 유형 드롭다운을 사용하여 "모든 유형", "주요 코인" 또는 "신규 코인"을 선택하세요.
  - 두 개의 입력 필드를 사용해 가격 범위를 입력하고 가격별로 필터링하세요.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 정렬 상태 관리.
 

 ## 8. 코인 보기 및 즐겨찾기
- 설명: 각 코인에 대한 자세한 정보를 보고 즐겨찾기에 추가합니다.
- 사용법:
  - 코을 클릭하면 자세한 정보를 볼 수 있습니다.
  - 코인 카드의 별표 아이콘을 클릭하면 해당 코인 카드를 즐겨찾기에 추가하거나 즐겨찾기에서 제거할 수 있습니다.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 즐겨찾기 상태 관리.
  - `Next.js Link`: 코인 상세 페이지로 이동하기 위해 사용.

 ## 9. 더 많은코인 불러오기
- 설명: 코인 목록을 볼 때 더 많은 코인을 불러옵니다.
- 사용법: 맨 밑에 "더 보기" 버튼을 클릭하면 더 많은 코인을 가져와서 표시합니다.
- 기술스택:
  - `React Hooks`: `useState`와 `useEffect`를 사용하여 페이지 상태 및 코인 데이터 관리.
  - `Fetch API`: 더 많은 코인 데이터를 불러오기 위해 사용.

 ## 10. 알림 필터링
- 설명: 모든 코인이나 특정 코인에 대한 알림을 표시하기 위해 알림을 필터링합니다.
- 사용법:"가격 알림" 섹션의 드롭다운 메뉴를 사용하여 "모든 알림" 또는 특정 코인을 선택하세요.
- 기술스택:
  - `React Hooks`: `useState`를 사용하여 알림 필터 상태 관리.

<br><br>

## CoinList 컴포넌트 중복 코인 트러블 슈팅 문제 해결

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

### 결론
이러한 단계를 구현함으로써 중복 코인 항목 문제를 성공적으로 해결했습니다. 핵심은 필터와 렌더링을 적용하기 전에 고유한 항목을 보장하는 것이었습니다. 이 접근 방식은 암호화폐 데이터를 깨끗하고 효율적이며 사용자 친화적으로 표현할 수 있도록 합니다.



<br><br><br><br><br><br>






