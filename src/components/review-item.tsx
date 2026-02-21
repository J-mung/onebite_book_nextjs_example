import { ReviewData } from "@/types";
import DeleteReviewItemButton from "./delete-review-item-button";
import style from "./review-item.module.css";

export default function ReviewItem({
  id,
  content,
  author,
  createdAt,
  bookId,
}: ReviewData) {
  return (
    <div className={style.container}>
      <div className={style.author}>{author}</div>
      <div className={style.content}>{content}</div>
      <div className={style.button_container}>
        <div className={style.date}>{new Date(createdAt).toLocaleString()}</div>
        <div className={style.delete_btn}>
          <DeleteReviewItemButton bookId={bookId} reviewId={id} />
        </div>
      </div>
    </div>
  );
}
