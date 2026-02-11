import BookItem from "@/components/book-item";
import books from "@/mock/books.json";
import style from "./page.module.css";

export default function Page() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {books.map((_book) => (
          <BookItem key={`reco-${_book.id}`} {..._book} />
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
