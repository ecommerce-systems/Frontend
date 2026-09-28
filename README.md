# Frontend — ShopHub

React 기반 이커머스 프론트엔드. Spring Boot 백엔드와 연동합니다.

**라이브:** https://www.ecommerce.p-e.kr

---

## 스택

| | |
|---|---|
| UI | React 19 + React Router 7 |
| 번들러 | Vite 7 |
| HTTP | Axios (JWT 인터셉터, 토큰 자동 갱신) |
| 배포 | GitHub Actions → Google Drive → Nginx (self-hosted) |

---

## 주요 기능

- **상품 검색** — 자동완성, 전체 목록 페이징
- **상품 상세** — 스펙, 연관 상품(공동구매 데이터 기반)
- **장바구니** — 수량 조절, 이미지/이름 표시, 상세 페이지 링크
- **주문** — 장바구니 → 주문 생성, 주문 내역 조회
- **공동구매 분석** — 상품 ID로 함께 구매된 연관 상품 탐색
- **인증** — 로그인/회원가입, 게스트 계정 원클릭 생성, JWT 자동 갱신

---

## 로컬 실행

```bash
npm install
npm run dev
```

환경변수 (`.env`):

```
VITE_APP_BACKEND_URL=http://localhost:8080
```

---

## 배포 흐름

```
push to master
  → CI: npm build → rclone upload → Google Drive
  → CD: Google Drive download → Nginx /html 교체
```

secrets: `RCLONE_CONF_B64`
