import BookItem from "@/components/book-item";
import books from "@/mock/books.json";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const { q } = await searchParams;

  return (
    <div>
      {books.map((_book) => (
        <BookItem key={_book.id} {..._book} />
      ))}
    </div>
  );
}
