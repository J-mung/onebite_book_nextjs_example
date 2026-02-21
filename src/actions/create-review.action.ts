"use server";

import { delay } from "@/util/delay";
import { revalidateTag } from "next/cache";

const createReviewAction = async (prevState: unknown, formData: FormData) => {
  await delay(3000);

  const bookId = formData.get("bookId");
  const content = formData.get("content");
  const author = formData.get("author");

  try {
    if (!bookId || !content || !author) throw new Error("잘못된 요청입니다.");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review`, {
      method: "POST",
      body: JSON.stringify({
        bookId,
        content,
        author,
      }),
    });

    if (!response.ok) throw new Error(response.statusText);
    revalidateTag(`review-${bookId}`);

    return {
      status: true,
      message: "리뷰를 성공적으로 추가했습니다.",
    };
  } catch (e) {
    return {
      status: false,
      message: `새로운 리뷰를 추가하지 못했습니다. : ${e}`,
    };
  }
};

export default createReviewAction;
