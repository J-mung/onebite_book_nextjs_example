import books from "@/mock/books.json";
import style from "./page.module.css";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // URL 경로를 동적으로 생성할 때 페이지 라우트와 마찬가지로 대괄호([])를 사용.
  // params로 참조 가능하다.
  const { id } = await params;
  const { title, subTitle, description, author, publisher, coverImgUrl } =
    books[0];

  return (
    <div className={style.container}>
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
    </div>
  );
}
