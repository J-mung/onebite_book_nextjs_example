"use client";

import deleteReviewAction from "@/actions/delete-review.action";
import { useActionState, useEffect, useRef } from "react";

export default function DeleteReviewItemButton({
  bookId,
  reviewId,
}: {
  bookId: number;
  reviewId: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState(deleteReviewAction, null);

  useEffect(() => {
    if (state && !state.status) {
      alert(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={action}>
      {isPending ? (
        <div>...</div>
      ) : (
        <div
          onClick={() => {
            if (formRef.current) formRef.current.requestSubmit();
          }}
        >
          삭제하기
        </div>
      )}
      <input name="bookId" value={bookId} type="hidden" readOnly />
      <input name="reviewId" value={reviewId} type="hidden" readOnly />
    </form>
  );
}
