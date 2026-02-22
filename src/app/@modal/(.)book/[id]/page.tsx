import BookPage from "@/app/book/[id]/page";
import Modal from "@/components/modal";
import { Suspense } from "react";
import BookPageSkeleton from "./book-page-skeleton";

export default function Page(props: any) {
  return (
    <Modal>
      <Suspense fallback={<BookPageSkeleton />}>
        <BookPage {...props} />
      </Suspense>
    </Modal>
  );
}
