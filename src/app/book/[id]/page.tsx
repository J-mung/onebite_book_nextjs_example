import ReviewEditor from "@/components/review-editor";
import ReviewItem from "@/components/review-item";
import { BookData, ReviewData } from "@/types";
import style from "./page.module.css";

/**
 * generateStaticParams()
 * - build 시 실행되어 동적 라우트에 필요한 params를 미리 생성한다.
 * - 반환된 params 개수만큼 정적 페이지가 생성된다 (SSG)
 */
export async function generateStaticParams() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book`);
  if (!response.ok) throw new Error(response.statusText);

  const books: BookData[] = await response.json();

  return books.map((_book) => ({
    id: String(_book.id),
  }));
}

async function BookDetail({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/book/${bookId}`,
    {
      cache: "force-cache",
    },
  );
  if (!response.ok) throw new Error(response.statusText);

  const book: BookData = await response.json();
  const { title, subTitle, description, author, publisher, coverImgUrl } = book;

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

async function ReviewList({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/review/book/${bookId}`,
    { next: { tags: [`review-${bookId}`] } },
  );
  if (!response.ok) throw new Error(response.statusText);

  const reviews: ReviewData[] = await response.json();

  return (
    <section>
      {reviews.map((_review) => (
        <ReviewItem key={`review-item-${_review.id}`} {..._review} />
      ))}
    </section>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // URL 경로를 동적으로 생성할 때 페이지 라우트와 마찬가지로 대괄호([])를 사용.
  // params로 참조 가능하다.
  const { id } = await params;

  return (
    <div className={style.container}>
      <BookDetail bookId={id} />
      <ReviewEditor bookId={id} />
      <ReviewList bookId={id} />
    </div>
  );
}
