"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import style from "./modal.module.css";

export default function Modal({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return createPortal(
    <div
      className={style.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          router.back();
        }
      }}
    >
      <div className={style.modal}>{children}</div>
    </div>,
    document.getElementById("modal-root") as HTMLElement,
  );
}
