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
