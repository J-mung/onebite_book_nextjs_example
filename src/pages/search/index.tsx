import BookItem from "@/components/book-item";
import SearchbarLayout from "@/components/searchbar-layout";
import books from "@/mock/books.json";
import { ReactNode } from "react";

export default function Page() {
  return (
    <div>
      {books.map((_book) => (
        <BookItem key={_book.id} {..._book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchbarLayout>{page}</SearchbarLayout>;
};
