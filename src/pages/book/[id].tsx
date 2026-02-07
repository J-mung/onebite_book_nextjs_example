import books from "@/mock/books.json";
import style from "./[id].module.css";

// 파일명에 대괄호[]를 사용함으로써 동적 라우팅 생성
export default function Page() {
  const { id, title, subTitle, description, author, publisher, coverImgUrl } =
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
