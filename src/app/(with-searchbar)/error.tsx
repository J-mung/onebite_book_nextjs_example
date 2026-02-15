"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js App Router Error Boundary
 *
 * - 해당 route segment를 Error Boundary로 감싸는 특수 파일
 * - 렌더링 중 throw 된 에러를 가장 가까운 error.tsx가 처리
 * - 파일명은 반드시 error.tsx 이어야 함
 *
 * reset()
 *   : 에러 상태를 초기화하고 boundary 내부를 다시 렌더링
 *
 * router.refresh()
 *   : 서버 컴포넌트를 다시 실행하도록 요청 (RSC fetch 재수행)
 */
export default function Error({ error, reset }: Props) {
  const router = useRouter();

  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
      <button
        onClick={() => {
          // 서버 컴포넌트를 다시 실행할 때 비동기로 처리함
          // 이때 응답이 오지 않은 상태로 reset()을 수행하면 에러 상태가 유지되어,
          // 에러 처리가 되지 않음
          // startTransition()을 사용해 해결 가능
          startTransition(() => {
            router.refresh(); // 서버 컴포넌트를 다시 실행하도록 요청
            reset(); // 에러 상태 초기화, 컴포넌트를 페이지에 다시 렌더링
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
