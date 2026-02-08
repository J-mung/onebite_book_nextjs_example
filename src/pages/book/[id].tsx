import fetchBooks from "@/lib/fetch-books";
import fetchOneBook from "@/lib/fetch-one-book";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import style from "./[id].module.css";

// 빌드 타임에 동적 라우트로 생성할 경로 목록을 미리 정의하는 내장 메서드
export async function getStaticPaths() {
  const books = await fetchBooks();

  return {
    paths: books.map((_book) => ({ params: { id: String(_book.id) } })),
    fallback: true,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = context.params!.id;
  const book = await fetchOneBook(Number(id));

  return { props: { book } };
}

// 파일명에 대괄호[]를 사용함으로써 동적 라우팅 생성
export default function Page({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>로딩 중입니다...</div>;
  }

  if (!book) {
    return (
      <div>
        <Head>
          <title>한입북스 - 검색결과</title>
          <meta property="on:image" content="/thumbnail.png" />
          <meta property="og:title" content="한입북스 - 검색결과" />
          <meta
            property="og:description"
            content="한입북스에 등록된 도서들을 만나보세요"
          />
        </Head>
        오류가 발생했습니다. 다시 시도해주세요.
      </div>
    );
  }

  const { id, title, subTitle, description, author, publisher, coverImgUrl } =
    book;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={coverImgUrl} />
      </Head>
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
    </>
  );
}
