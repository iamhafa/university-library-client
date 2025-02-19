"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NotFound from "@/app/not-found";
import BookServiceApi, { Book } from "@/services/book.service";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<Book>();

  useEffect(() => {
    (async () => {
      const { dataPart } = await BookServiceApi.getOneById(id);
      setBookDetail(dataPart);
    })();
  }, []);

  if (!bookDetail) return <NotFound />;
  else {
    return <></>;
  }
}
