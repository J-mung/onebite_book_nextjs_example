## 앱 라우터 방식 메모

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

## 앱 라우터 데이터 페칭(fetching)

- 기존 페이지 라우터(Page Router) 방식에서는 `getServerSideProps`나 `getStaticProps` 함수로 서버단 데이터 페칭을 활용한다.
  - 두 함수는 서버에서만 실행되며, 반환된 데이터를 Page 컴포넌트의 Props로 전달해 SSR에 활용한다.

  ```typescript
  # fetch example
  // 서버에서만 실행되는 코드
  export async function getServerSideProps() {
    // 데이터 페칭 코드
    return { props: {...}};
  }

  // 서버에서만 실행되는 코드
  export async function getStaticProps() {
    // 데이터 페칭 코드
    return { props: {...}};
  }

  # page example
  // 서버와 클라이언트에서 모두 실행되는 코드
  export function Page(props) {
    return <div>...</div>;
  }
  ```

  - 이 방식은 데이터를 Page 레벨에서만 가져오는 구조적 제약이 있었고,
    하위 컴포넌트로 전달하는 과정에서 `Props Drilling`이 발생하기 쉬웠다.

- 앱 라우터(App Router) 방식에서는 서버 컴포넌트(Server Component) 개념을 도입해서 컴포넌트가 직접 데이터 페칭을 수행키로 설계됐다.
  - 데이터를 Page 레벨에서만 가져올 수 있었던 구조적 제약이 있었으나,
  - 서버 컴포넌트를 통해 상위에서 데이터를 내려주는 구조 없이, 필요한 위치에서 데이터를 가져오는 방식이 가능해졌다.

  ```typescript
  export default async function Page() {
    // 데이터 페칭 코드
    const response = await fetch(...);
    const allBooks: BookData[] = await response.json();

    return (...)
  }
  ```

  - 그렇지만 페칭으로 수반되는 에러 핸들링도 서버 컴포넌트가 수행하게 됐다.
  - 단, `error.tsx`는 서버 컴포넌트 에러를 처리하지만, `error.tsx` 자체는 반드시 클라이언트 컴포넌트 여야 한다.
    - try/catch 기반 처리
    - `error.tsx` 기반의 에러 핸들러 처리

## `error.tsx` 기반 에러 핸들러

- 유사한 유형의 error를 공통적으로 처리하기 위해 `error.tsx` 기반의 에러 핸들러(Error Boundary)를 구성할 수 있다.
- 에러 핸들러 구성은 아래의 세부내용을 따른다.
  - 에러 핸들러는 반드시 `error.tsx`명으로 파일을 생성한다.
  - 에러를 처리하려는 라우트 segment와 동일 레벨 또는 상위 레벨 디렉터리에 배치할 수 있다.
  - 앱 라우트 방식에서는 에러가 발생한 컴포넌트를 기준으로 가장 가까운 `error.tsx`가 에러 핸들러로 동작한다.
  - 이는 런타임에서 탐색하는 구조가 아니라, Next.js가 빌드 시 해당하는 segment를 에러 핸들러로 자동 래핑하기 때문이다.

```typescript
1. 동일 레벨 구조 (page와 같은 위치에 error.tsx 존재)

app/
├─ layout.tsx                // Global Layout
├─ error.tsx                 // Root Error Boundary
├─ (with-searchbar)/
│   ├─ layout.tsx
│   ├─ page.tsx              // 여기서 에러 발생한다고 가정
│   └─ error.tsx             // ← 가장 가까운 boundary (우선 적용)
└─ admin-config/
    ├─ layout.tsx
    └─ page.tsx


2. 상위 레벨 구조 (상위 segment의 error.tsx가 처리)

app/
├─ layout.tsx
├─ error.tsx                 // Root Boundary
├─ (with-searchbar)/
│   ├─ layout.tsx
│   └─ page.tsx              // 에러 발생 -> root error.tsx가 처리
└─ (without-searchbar)/
    ├─ layout.tsx
    └─ page.tsx


```

- 주의할 점은, `error.tsx`는 단순 화면 교체가 아니라 해당 세그먼트 트리 전체를 대체한다.
- 따라서 에러 핸들러가 걸린 위치 아래의 `layout.tsx`, `page.tsx`, children 컴포넌트는 모두 렌더링되지 않는다.
- 너무 상위에 배치하면 의도치 않게 전체 UI가 사라질 수 있으니 주의해야 한다.

```typescript
// `(with-searchbar)/layout.tsx`는 검색창을 포함하는 레이아웃을 출력함
// `(with-searchbar) page.tsx`에서 에러가 발생하면
// 상위 세그먼트에 위치하는 `error.tsx`가 에러 핸들러로 지정
// 이때 `(with-searchbar)/layout.tsx`가 렌더링되지 않아 검색창이 사라짐
app/
├─ layout.tsx
├─ error.tsx                 // Root Boundary
├─ (with-searchbar)/
│   ├─ layout.tsx
│   └─ page.tsx              // 에러 발생
└─ (without-searchbar)/
    ├─ layout.tsx
    └─ page.tsx
```

## 서버 컴포넌트 fetch 동작 방식과 캐싱 전략

- 앱 라우터에서 서버 컴포넌트는 fetch()를 직접 사용할 수 있으며, Next.js는 해당 요청을 단순 네트워크 호출이 아닌 데이터 캐시 레이어 위에서 관리한다.
- 즉, 동일한 요청에 대해 불필요한 중복 호출을 방지하기 위해 **자동 메모이제이션(memoization)**이 적용된다.
  - Next.js의 fetch 캐싱 전략과 Request Memoization은
  - Next.js가 확장한 fetch API에서만 동작한다.
  - **axios와 같은 외부 HTTP 라이브러리도 사용할 수 있지만 Next.js의 Data Cache 및 deduplication 최적화는 적용되지 않는다.**

- fetch 요청의 기본 동작
  - 서버 컴포넌트에서 동일한 URL로 여러 번 페치를 호출하더라도,
  - Next.js는 내부적으로 요청을 dedupe하여 한 번의 요청 결과를 공유한다.
  - 단, 메모이제이션은 동일한 렌더링 트리 안에서만 동작한다.
  - 다른 요청 사이에서는 캐시 전략(cache/revalidate)에 따라 동작한다.

  ```typescript
  const data1 = await fetch("/api/books");
  const data2 = await fetch("/api/books");

  // 실제 네트워크 요청은 1번만 수행될 수 있음
  ```

  - 이는 React 서버 컴포넌트 환경에서 동일 데이터에 대한 중복 페치를 줄이기 위한 설계이다.

- 페치 캐시 전략 옵션
  - 앱 라우트에서는 페치 옵션을 통해 데이터 캐시 전략을 직접 제어할 수 있다.
  - 1. 기본 캐시 (force-cache)
    - 기본적으로 Next.js는 페치 요청을 캐싱하려고 시도한다.
    - 빌드 시점 또는 요청 시점에 데이터가 재사용될 수 있다.

    ```typescript
    await fetch(url, { cache: "force-cache" });
    ```

    - 동일 요청 시 캐시된 데이터를 재사용하고, 정적 데이터에 적합한 특징이 있다.

  - 2. 항상 새 데이터 요청 (no-store)

    ```typescript
    await fetch(url, { cache: "no-store" });
    ```

    - 캐시를 사용하지 않고, 매 요청마다 서버에서 데이터를 다시 가져온다.
    - 기존 페이지 라우터의 `getServerSideProps`와 유사한 동작이다.
    - 실시간 데이터 / 사용자별 데이터 / 매 요청마다 변하는 API에 활용하기 적절하다.

  - 3. 유지 시간 지정 (revalidate)

    ```typescript
    await fetch(url, { next: { revalidate: 60 } });
    ```

    - 일정 시간 동안 캐시를 유지한다. (초단위)
    - 지정된 시간이 지나면 다음 요청 시 캐시가 재검증된다.
    - 일정 주기로 업데이트 되는 콘텐츠 / 뉴스 목록 / 상품 리스트 등에 활용하기 적절하다.

  - 4. 정리
    ```
    옵션               동작 방식            기존 개념
    force-cache       캐시 재사용           SSG 느낌
    no-store          항상 새 요청          SSR 느낌
    revalidate        일정 주기 갱신         ISR 느낌
    ```

## 스트리밍(Streaming)과 스켈레톤(Skeleton)

- 스트리밍(Streaming)이란 SSR의 단점인 응답 속도를 보완하는 것으로 html을 청크(chunk) 단위로 나눠서 점진적으로 응답해주는 기법이다.
  - Next.js는 페이지의 모든 컴포넌트를 렌더링한 다음, 완성된 HTML 페이지로 브라우저에 응답한다.
  - 이때 특정 컴포넌트에서 응답 지연이 발생해서 렌더링 병목이 발생하면 페이지 응답 자체가 느려지는 문제가 있다.

  ```
  #1 루트 레이아웃(10ms 소요)
  #2 검색 폼 레이아웃(12ms 소요)
  #3 검색 폼 컴포넌트(13ms 소요)
  #4 페이지 컴포넌트(3,300ms 소요) *지연 발생*
  ```

  - 이러한 문제를 해결해주는 것이 스트리밍이다.
  - 참고로 스트리밍은 다이나믹(dynamic) 페이지에서만 동작한다.
    - 강세 설정하는 법
    ```typescript
    // 페이지 컴포넌트 위에 "dynamic" 라우트 세그먼트 컨픽 작성
    export const dynamic = "force-dynamic";
    ```

- 스트리밍: loading.tsx
  - 폴더 아래에 loading.tsx를 생성하면 해당 파일의 경로를 포함해 아래 경로의 페이지는 모두 자동으로 스트리밍할 수 있다.

  ```typescript
  export default function Loading() {
    return <div>검색 결과를 불러오는 중입니다...</div>
  }
  ```

  - 편리하지만 2가지 단점이 존재한다.
    - 페이지 컴포넌트만 점진적으로 렌더링할 수 있다.
      - 페이지 컴포넌트 이외의 컴포넌트에서 비동기 데이터를 호출하더라도 스트리밍이 불가능하다.
    - 쿼리 스트링 변경은 스트리밍을 다시 유발하지 않는다.
      - 동일한 url에 대해서 최초 1회에 한해서 loading.tsx 동작한다.
      - 즉, 검색 폼에서 검색어를 입력하면 딱 1번만 스트리밍이 발생하고 이후부터는 검색어를 변경해도 스트리밍이 동작하지 않는다.

- 스트리밍: Suspense 컴포넌트
  - loading.tsx의 단점을 해결할 수 있는 컴포넌트이다.
  - 특정 경로 세그먼트에 대한 폴백을 생성하고, 콘텐츠가 준비되는 대로 자동으로 스트리밍할 수 있게 하는 Suspense 기반의 로딩 UI를 사용한다.
  - 쿼리 스트링이 변경될 때에도 스트리밍을 발생시키기 위해서는 Suspense 컴포넌트의 key 값을 지정할 필요가 있다.
    - React 렌더링의 특징으로, key 바뀌면 가상 DOM이 새로운 컴포넌트로 변경됐다고 인지해 리렌더링되기 때문이다.

  ```typescript
  // 기본 사용
  import { Suspense } from 'react'
  import { PostFeed, Weather } from './Components'

  export default function Posts() {
    return (
      <section>
        <Suspense fallback={<p>Loading feed...</p>}>
          <PostFeed />
        </Suspense>
        <Suspense fallback={<p>Loading weather...</p>}>
          <Weather />
        </Suspense>
      </section>
    )
  }
  ```

  ```typescript
  // Suspense key 지정()
  export default async function Page({
    searchParams
  }: {
    searchParams: Promise<{q?: string}>
  }) {
    const { q } = await searchParams;

    return (
      <Suspense
        key={q || ""}
        fallback={<div>검색 결과를 불러오는 중입니다...</div>}
      >
        <SearchResult q={q || ""} />
      </Suspense>
    );
  }
  ```

- 스켈레톤(Skeleton)은 렌더링할 콘텐츠의 최종 모습을 간략히 보여 주는 로딩 UI를 말한다.
- 대략적인 UI를 사용자에게 제공해주므로 단순 텍스트로 안내하는 것보다 훨씬 더 개선된 UX를 제공할 수 있다.
- 보여주고자 하는 스켈레톤 UI를 생성해서 Suspense의 fallback으로 지정하면 된다.

## 서버 액션(Action)

### 들어가며

- 우리는 웹 화면에서 수많은 목록들을 확인할 수 있다.
- 이때 저장하기 제출하기와 같은 버튼을 눌렀을 때 결과가 반영되서 새로운 항목이 목록에 추가되길 기대한다.
- 즉, [ 버튼 클릭 - 데이터 전송 - 새 목록 불러오기 ]와 같은 흐름이 한 번에 진행되길 기대하는 것이다.
- Next.js에서는 **서버 액션**과 **revalidatePath**를 활용해서 간편하게 구현할 수 있다.

### 개념

> 서버 액션(Action)이란 애플리케이션에서 폼 제출 및 데이터 변조를 처리하기 위해 서버에서 실행되는 비동기 함수이다.

- 조금 더 쉽게 설명하면 Next.js 서버에서 실행되는 비동기 함수 가운데 클라이언트가 직접 호출할 수 있는 함수이다.

- 다음의 코드가 간단하게 구현한 서버 액션의 예시이다.

```typescript
  // src/app/test/page.tsx

  export default function Page() {
    const addReviewAction = async (formData: FromData) => {
      "use server";

      const content = formData.get("content");
      const reviewer = formData.get("reviewer");

      console.log ({ content, reviewer });
    };

    return (
      <form action={addReviewAction}>
        <input type="text" name="content" />
        <input type="text" name="reviewer" />
        <button type="submit">작성하기</button>
      </form>
    );
  }

  // 실행결과
  { content: "리뷰입니다.", reviewer: "J_mung" }
```

- 게시글에 리뷰를 작성한다고 가정하자.
- 간단하게 리뷰 내용, 작성자, 작성하기 버튼으로 구성된 form이 있다.
- 사용자는 원하는 내용과 작성자를 타이핑 하고 작성하기 버튼을 누르게 된다.
- 그러면 브라우저는 서버로 데이터를 전송하여 console에 로그를 찍는 걸 확인할 수 있다.

- 위와 같은 기능을 지원하기 위해 전통적인 방식으로 구현한다면 다음과 같은 과정들이 필요하다.
  - 1. REST API 설계 및 구현
  - 2. API 엔드포인트 정의
  - 3. 처리 핸들러 구현
  - 4. 요청 및 응답 처리
  - 5. 상태 코드 관리
  - 6. 에러 핸들러

- 그러나 Next.js에서는 서버에서 실행할 함수를 간단하게 정의해서 클라이언트가 호출할 수 있도록 지원하기 때문에
- 코드를 매우 간결하게 작성하면서 생산성을 높일 수 있게 된다.
- 게다가 서버 액션은 Next.js 서버에서 동작하는 함수이므로 브라우저에 코드가 노출되지 않는 장점도 있다.
- 덕분에 보안이 중요한 작업에도 많은 도움을 준다.

### 클라이언트가 서버 함수를 호출할 수 있는 이유

- 신기한 점은 서버 액션 함수는 서버에서만 존재하기 때문에 클라이언트는 함수 코드를 알 수 없다.
- 그럼에도 불구하고 클라이언트가 서버 액션 함수를 실행시킬 수 있는 이유는 클라이언트가 서버 액션 ID를 알기 때문이다.
- 빌드를 진행하면서 페이지를 생성할 때 "use server" 명령어에 의해 서버 액션 함수도 컴파일된다.
- 컴파일 되면서 서버 액션 ID가 함께 생성되고 함수 식별 키로서 사용하게 된다.
- 클라이언트에서는 form의 action 속성과 같은 곳에 서버 액션 ID를 저장하게 된다.
- 이 ID는 클라이언트가 서버에 요청할 때 함께 전송되어 어떤 서버 액션을 실행할지 Next.js 서버가 판단하게 된다.

```
  사용자                브라우저                  Next.js 서버
        폼 제출
                              POST 요청
                              Next-Action 필드로
                              서버 액션 아이디 포함
                                                      서버 액션 실행
                              응답
```

- 간단하게 설명하기 위해서 "호출"이라는 용어를 사용했으나 사실은 서버 액션 ID 값을 넘김으로써
- 서버가 함수를 실행하도록 요청한 것이다.
- 이러한 기법을 RPC(Remote Procedure Call)이라고 부르며 Next.js에서 이 모든 과정을
- 추상화 하고 있기 때문에 우리는 간편하게 사용하기만 하면 된다.

### 주의사항

- [ 1. "함수"라는 것에 집중하자 ]
- 예시로 form 태그를 활용해서 form에서만 사용할 수 있는 것처럼 보일 수 있으나 그렇지 않다.
- 비동기 함수를 하나 선언해서 내부에 서버 액션 함수를 호출하도록 정의한다.
- 버튼의 click 이벤트에 비동기 함수를 바인딩하여 실행되도록 하면 정상 작동하는 모습을 확인할 수 있다.

  ```typescript
  // src/app/test/add-review.action.ts
  "use server";
  export const addReviewAction = async (formData: FormData) => {
    const content = formData.get("content");
    const reviewer = formData.get("reviewer");

    console.log({ content, reviewer });
  };
  ```

  ```typescript
  "use client"

  export default function Page() {
    const contentRef = useRef<HTMLInputElement>(null);
    const reviewerRef = useRef<HTMLInputElement>(null);

    const onClickAddReview = async () => {
      if (!contentRef || !reviewerRef) reutrn;

      const content = contentRef.current.value;
      const reviewerRef = reviewerRef.current.value;

      const formData = new FormData();
      formData.set("content", content);
      formData.set("reviewer", reviewer);

      await addReviewAction(formData);
    };

    return (
      <div>
        <input type="text" name="content" />
        <input type="text" name="reviewer" />
        <button onClick={onClickAddReview}>작성하기</button>
      </div>
    );
  }
  ```

- [ 2. 비동기 함수로 만들어야 한다. ]
- 특별한 이유는 없다. 단지 서버 액션 자체가 비동기 함수로 설계 됐기 때문이다.
- 만약 함수를 동기적으로 구현한다면 오류가 발생한다.

  ```typescript
  "use server";
  // async 제거
  export const addReviewAction = (formData: FormData) => {
    const content = formData.get("content");
    const reviewer = formData.get("reviewer");

    console.log({ content, reviewer });
  };
  ```

  > "Server Actions must be async function"

- 상당히 친절한 오류이므로 지키도록 하자.
