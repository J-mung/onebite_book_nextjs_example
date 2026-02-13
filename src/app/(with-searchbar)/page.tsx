import BookItem from "@/components/book-item";
import { BookData } from "@/types";
import style from "./page.module.css";

async function AllBooks() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book`, {
      cache: "force-cache", // 요청 시, 데이터 캐시 사용
    });
    if (!response.ok) throw new Error(response.statusText);

    const allBooks: BookData[] = await response.json();

    return (
      <div>
        {allBooks.map((_book) => (
          <BookItem key={_book.id} {..._book} />
        ))}
      </div>
    );
  } catch (err) {
    console.error(err);
    return <div>오류가 발생했습니다.</div>;
  }
}

async function RecoBooks() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/book/random`,
      { next: { revalidate: 5 } }, // 5번까지 데이터 캐시 사용하며 이후에 데이터 갱신
    );
    if (!response.ok) throw new Error(response.statusText);

    const recoBooks: BookData[] = await response.json();

    return (
      <div>
        {recoBooks.map((_book) => (
          <BookItem key={_book.id} {..._book} />
        ))}
      </div>
    );
  } catch (err) {
    console.error(err);
    return <div>오류가 발생했습니다.</div>;
  }
}

export default function Page() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        <RecoBooks />
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        <AllBooks />
      </section>
    </div>
  );
}
