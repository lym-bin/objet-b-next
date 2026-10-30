# Objet & B — Next.js 버전

Vite 기반 Objet & B의 상품 목록·상세·장바구니를 Next.js(App Router)로 다시 만들었습니다.

- 배포: https://objet-b-next.vercel.app
- 원본 (Vite + React): https://github.com/lym-bin/my-react-app

## 왜 다시 만들었나

같은 쇼핑몰이라도, 서버가 미리 만든 HTML(SSG)과 브라우저가 JS로 채우는 화면(CSR)은 처음 받는 내용이 어떻게 다른지 확인하고 싶었습니다.

## Vite 버전과 비교

| | Vite 버전 (CSR) | Next.js 버전 (SSG) |
| --- | --- | --- |
| 처음 받는 HTML | 	`<div id="root"></div>` 만 있고 상품 내용 없음 | 상품 이름·가격이 이미 들어 있음 |
| 상품 페이지 title | 모든 페이지 공통 (Objet & B \| 미니멀리스트 쇼핑몰) | 상품마다 다름 (상품명 \| Objet & B) |
| 카카오톡 링크 미리보기 | 어느 상품이든 같은 모델 사진 | 그 상품의 사진과 이름 |

## 사용 기술

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- 배포: Vercel    

## 기능

- 상품 목록 (`/products`): 서버 컴포넌트에서 상품 데이터를 바로 그림
- 상품 상세 (`/products/[id]`): `generateStaticParams`로 빌드 때 16개를 미리 생성, `generateMetadata`로 상품마다 제목·설명·대표 이미지 지정
- 옵션 선택 + 장바구니 담기: 옵션은 `"use client"` 컴포넌트, 장바구니는 Context + localStorage (첫 화면은 서버와 맞추고 마운트 후 불러옴)
- 공통 헤더: 서버 컴포넌트, 장바구니 개수만 클라이언트 컴포넌트로 분리
- 없는 주소·없는 상품: `not-found.tsx` (상세에서 상품이 없으면 `notFound()`)
- 서버 금액 계산 (`POST /api/amount`): Route Handler. 상품 번호와 수량만 받아 서버가 합계를 다시 계산, 잘못된 요청은 400

## 폴더 구조

```
app/                        ← 폴더 이름이 곧 주소
├─ layout.tsx               공통 틀 (헤더 + 장바구니 Provider)
├─ page.tsx                 /  메인
├─ not-found.tsx            없는 주소 안내
├─ products/
│  ├─ page.tsx              /products  상품 목록
│  └─ [id]/page.tsx         /products/1  상품 상세 (빌드 때 16개 미리 생성)
└─ api/amount/route.ts      /api/amount  서버 금액 계산 (POST)
components/
├─ Header.tsx               서버 컴포넌트
├─ CartCount.tsx            클라이언트 컴포넌트(장바구니 카운트)
├─ ProductCard.tsx          서버 컴포넌트(상품 카드, 이름, 이미지, 가격)
└─ ProductOptions.tsx       클라이언트 컴포넌트(상품 색상, 사이즈, 수량)
context/CartContext.tsx     장바구니 상태 + useCart 훅
data/                       상품·옵션 데이터, 주문 규칙(MAX_QTY)
utils/calculateAmount.ts    서버 금액 계산 함수
```
## 트러블슈팅

### 1. 장바구니 하이드레이션

- **문제:** 장바구니를 `useState` 초기값에서 localStorage로 바로 읽으면, 서버가 만든 HTML(빈 장바구니)과 브라우저의 첫 화면(저장된 상품)이 달라질 수 있음
- **원인:** `"use client"` 컴포넌트도 첫 화면은 서버에서 그려지는데, 서버에는 localStorage가 없음
- **해결:**
  - 첫 화면은 서버와 똑같이 빈 배열로 시작하고, 마운트 직후 실행되는 `useEffect`에서 localStorage를 불러옴
  - 저장 effect는 불러오기 전에 빈 배열로 덮어쓰지 않도록 `isLoaded` 상태로 막음
  - 마운트 후 setState를 막는 lint 규칙(`react-hooks/set-state-in-effect`)은 의도한 한 줄에만 이유 주석과 함께 비활성화
 
### 2. 브랜치를 바꾼 뒤 tsc 에러

- **문제:** 다른 브랜치로 옮긴 뒤 `npx tsc --noEmit`을 실행하자, 지금 브랜치에는 없는 `radix-test` 페이지를 찾지 못한다는 에러가 남 (`.next/dev/types/validator.ts`)
- **원인:** 예전 브랜치에서 dev 서버를 띄웠을 때 Next.js가 `.next` 안에 만들어 둔 타입 검사 파일이 그대로 남아 있었음
- **해결:**
  - `.next` 폴더 삭제 (빌드 캐시라 지워도 되고 git에도 안 올라감)
  - 처음엔 바로 tsc를 돌렸더니 `LayoutProps`를 못 찾는 에러가 남 → 이 타입도 `.next`에서 자동 생성되기 때문
  - `npm run dev`를 먼저 실행해 타입을 다시 만든 뒤 tsc → 통과
  - 이후 에러 경로가 `.next/`로 시작하면 내 코드보다 오래된 캐시 문제부터 의심

## 배운 점

- `"use client"`는 "브라우저에서만 그린다"가 아니었다. 클라이언트 컴포넌트도 첫 화면은 서버에서 HTML로 만들어지고, 브라우저에서 이벤트가 붙는다(하이드레이션). 그래서 localStorage처럼 서버에 없는 값은 마운트 후에 읽어야 한다.
- 서버/클라이언트를 나누는 기준은 "그 파일이 훅이나 브라우저 기능을 직접 쓰는가"였다. 헤더 전체가 아니라 장바구니 개수만 클라이언트 컴포넌트로 분리했다.
- App Router에서는 폴더 이름이 주소가 되고, `route.ts`에서는 함수 이름이 받는 요청 방법이 된다. `POST`만 만든 `/api/amount`에 GET으로 접근하면 405가 돌아오는 것을 확인했다.
- 빌드 결과에서 페이지마다 ○(정적), ●(SSG), ƒ(요청마다 실행)로 나뉘는 것을 보고, 미리 만들 수 있는 페이지와 요청 내용을 봐야 하는 API의 차이를 이해했다.
- Vite 버전에서 Vercel 함수로 만들었던 서버 금액 검증을 Route Handler로 옮기면서, 둘 다 웹 표준 `Request`/`Response`를 쓴다는 것을 알게 됐다.

## 아직 안 한 것

- 요청마다 데이터를 가져오는 SSR: 상품 데이터가 코드에 고정돼 있어 지금은 SSG만 사용
- 테스트: Vite 버전에는 금액 계산 함수의 Vitest 테스트가 있지만, 이 저장소에는 아직 없음
- `/api/amount`를 화면에서 호출하기: 지금은 브라우저 콘솔로만 확인
- 장바구니 수량 변경·삭제 화면
- Redux Toolkit으로 장바구니 상태 관리 다시 만들기 (계획)



