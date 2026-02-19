import BookItem from "@/components/book-item";
import BookItemSkeleton from "@/components/book-item-skeleton";
import { BookData } from "@/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";

async function SearchResult({ q }: { q: string }) {
  await delay(3000);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/book/search?q=${q}`,
    {
      cache: "force-cache",
    },
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
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    // Suspense: fallback으로 비동기 처리 진행 중임을 보여주는 React 요소
    <Suspense
      key={q || ""}
      // JS 기교네 길이 3짜리 Array 만들어서 0으로 채우고 map으로 반복해서 컴포넌트 생성이라
      fallback={new Array(3).fill(0).map((_, idx) => (
        <BookItemSkeleton key={`search-result-skeleton-${idx}`} />
      ))}
    >
      <SearchResult q={q || ""} />
    </Suspense>
  );
}
