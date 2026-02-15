import { BookData } from "@/types";
import style from "./page.module.css";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    // URL 경로를 동적으로 생성할 때 페이지 라우트와 마찬가지로 대괄호([])를 사용.
    // params로 참조 가능하다.
    const { id } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/book/${id}`,
      { cache: "force-cache" }, // 요청 시, 데이터 캐시 사용
    );
    if (!response.ok) throw new Error(response.statusText);

    const book: BookData = await response.json();
    const { title, subTitle, description, author, publisher, coverImgUrl } =
      book;

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
  } catch (err) {
    console.error(err);
    return <div>오류가 발생했습니다.</div>;
  }
}
