### 앱 라우터 방식 메모

- 서버/클라이언트 컴포넌트를 사용하기 위해서는 적절한 위치에 "use server"/"use client"를 작성해야 함

  ```typescript
  # 파일 단위 적용: 소스코드 최상단
  "use server";
  // 혹은
  "use client";

  # 파일 내에서 컴포넌트 별로 적용: 컴포넌트 메서드 상단
  export function MyComponent() {
    "use server";
    // 혹은
    "use client";

    return (...)
  }
  ```

- 서버 컴포넌트는 비동기 함수(async)로 선언 가능한데 덕분에 SSR 시점에 데이터를 페칭해서 결과를 생성할 수 있다.
  - 서버 컴포넌트 실행 결과로 `RSC Payload`를 생성한다.
  - 특수한 형태의 직렬화 데이터로 다음의 데이터를 포함한다.
    - 서버 컴포넌트 렌더링 결과
    - 클라이언트 컴포넌트의 파일 위치
    - 전달할 Props
    - 그 외 클라이언트 컴포넌트와 연관된 정보

  > 렌더링의 전반적인 흐름은 Spring Boot의 MVC 패턴에서 Model에 값 할당해두고 thymleaf로 렌더링해서 응답내려주는.. 거로 이해하면 되겠네.

- 서버 컴포넌트 도입에 따른 주의사항
  - 클라이언트 컴포넌트는 일반적인 React 컴포넌트이다. 클라이언트에서만 실행되는 컴포넌트가 아니다.
  - 클라이언트 컴포넌트는 요청에 의해 사전 렌더링, 수화(Hydration) 작업을 실행하므로 총 2번 실행된다.
  - **이때 Window 객체와 같은 클라이언트에만 존재하는 객체를 접근하려 할 때 오류가 발생하므로 주의해야 한다.**
  - 서버 컴포넌트는 클라이언트 컴포넌트를 호출할 수 있지만, 그 반대는 오류가 발생한다.
  - 클라이언트 컴포넌트가 실행될 시점에는 서버 컴포넌트의 정보가 없기 때문이다.
  - 예외 허용
    - **원칙적으론** 클라이언트 컴포넌트가 서버 컴포넌트를 호출할 수 없지만,
    - 호출하게 되면 자동 전환이 발생해 서버 컴포넌트를 클라이언트 컴포넌트로 바꿔버린다. (어..)
    - 원칙을 준수하기 위해 이러한 자동 변환은 주의해야 하며, 어쩔 수 없이 의도해야 한다면
    - 서버 컴포넌트를 children Props로 전달하는 방법을 고려할 수도 있다.
    - 이렇게 하면 서버 컴포넌트의 렌더링 결과만 전달하므로 자동 전환이 발생하지 않고 클라이언트에서 실행되는 걸 방지할 수 있다.
  - 끝으로 직렬화가 되지 않은 Props는 전달할 수 없다.

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

- 디렉터리 구조로 라우트 되므로 API를 생성하는 구조도 동일하며, 아래의 세부내용을 따른다.
  - 디렉터리 경로는 API URL의 엔드포인트가 된다.
  - 최종 디렉터리 안에 `route.ts` 파일을 생성한다. (파일명 준수)
  - `route.ts` 파일에 HTTP method 명칭으로 메서드를 생성한다.

  ```typescript
  # directory
  /app/api/revalidate/route.ts

  # route.ts
  export function GET() {
    return new Response("테스트 API입니다.");
  }

  # URL
  segment: /app/api/revalidate
  method: GET
  request body: (NONE)
  response body: "테스트 API입니다."

  ```

### 앱 라우터 데이터 패칭(fetching)
