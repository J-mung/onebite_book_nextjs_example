import { revalidateTag } from "next/cache";

/**
 * /api/revalidate의 GET 요청에 대해 random-books 태그를 사용하는 캐시가 있으면 갱신
 */
export async function GET() {
  await revalidateTag("random-books");

  return new Response("random--books 태그 갱신 성공", { status: 200 });
}
