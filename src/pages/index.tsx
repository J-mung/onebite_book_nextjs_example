import BookItem from "@/components/book-item";
import SearchbarLayout from "@/components/searchbar-layout";
import books from "@/mock/books.json";
import { ReactNode } from "react";
import style from "./index.module.css";

export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {books.map((_book) => (
          <BookItem key={`recommend-${_book.id}`} {..._book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {books.map((_book) => (
          <BookItem key={`all-${_book.id}`} {..._book} />
        ))}
      </section>
    </div>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchbarLayout>{page}</SearchbarLayout>;
};
