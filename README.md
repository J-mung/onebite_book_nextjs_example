### 앱 라우터 방식 메모

- 클라이언트 컴포넌트를 사용하기 위해서는 코드 최상단에 "use client" 작성해야 함

  ```typescript
  "use client";
  ```

- 서버 클라이언트는 비동기 함수(async)로 선언 가능한데 덕분에 SSR 시점에 데이터를 페칭해서 결과를 생성할 수 있다.

  > Spring Boot의 MVC 패턴에서 Model에 값 할당해두고 thymleaf로 렌더링해서 응답내려주는.. 거로 이해하면 되겠네.

- useRoute를 사용할 때는 "next/navigation"에서 가져온다.

  > "next/router"에서 가져오지 않도록 주의한다.

- 앱 라우터는 `app` 디렉터리 하위의 디렉터리 구조로 라우터가 구성되는 구조이다.
  - 그리고 디렉터리 안에 `page.tsx`와 같은 파일을 구성해서 라우트 페이지를 생성할 수 있다.
  - Spring boot에서는 HTTP method anotation, 파일 경로,

  ```
  # directory
  /app/book/detail/page.tsx

  # URL segment
  /book/detail
  ```
