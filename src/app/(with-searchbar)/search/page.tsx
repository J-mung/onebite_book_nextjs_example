import BookItem from "@/components/book-item";
import { BookData } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  try {
    const { q } = await searchParams;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/book/search?q=${q}`,
      { cache: "force-cache" }, // 요청 시, 데이터 캐시 사용
    );
    if (!response.ok) throw new Error(response.statusText);

    const books: BookData[] = await response.json();

    return (
      <div>
        {books.map((_book) => (
          <BookItem key={_book.id} {..._book} />
        ))}
      </div>
    );
  } catch (err) {
    console.error(err);
    return <div>오류가 발생했습니다.</div>;
  }
}
