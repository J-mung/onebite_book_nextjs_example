import BookItem from "@/components/book-item";
import SearchbarLayout from "@/components/searchbar-layout";
import fetchBooks from "@/lib/fetch-books";
import { BookData } from "@/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

export default function Page() {
  const [books, setBooks] = useState<BookData[]>([]);

  const router = useRouter();
  const q = router.query.q;

  const fetchSearchResult = async () => {
    const data = await fetchBooks(q as string);
    setBooks(data);
  };

  useEffect(() => {
    if (q) {
      fetchSearchResult();
    }
  }, [q]);

  return (
    <div>
      <Head>
        <title>한입북스 - 검색결과</title>
        <meta property="og:title" content="한입북스 - 검색결과" />
        <meta
          property="og:description"
          content="한입북스에 등록된 도서들을 만나보세요"
        />
        <meta property="og:image" content="/thumbnail.png" />
      </Head>
      {books.map((_book) => (
        <BookItem key={_book.id} {..._book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchbarLayout>{page}</SearchbarLayout>;
};
