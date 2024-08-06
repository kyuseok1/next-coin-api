# 코인 정보 사이트

이 프로젝트는 React와 Next.js로 구축된 암호화폐 정보 대시보드입니다. 가격 알림, 정렬, 필터링 등 다양한 암호화폐에 대한 자세한 정보를 제공합니다. 아래에는 주요 기능, 사용 방법, 각 기능을 구축하는 데 사용된 기술 스택에 대한 세부 정보가 있습니다.

<br>
<br>


## 🚀 Demo 링크
https://next-coin-api.vercel.app/ <br><br>

## 🛠️ 기술 스택

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)



<br><br>
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# Features

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









<br><br><br><br><br><br>






