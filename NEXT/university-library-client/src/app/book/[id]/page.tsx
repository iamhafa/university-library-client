"use client";

import BookServiceApi, { Book } from "@/services/book.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();

  const [bookDetail, setBookDetail] = useState<Book>();

  useEffect(() => {
    (async () => {
      const { data } = await BookServiceApi.getOneById(id);
      setBookDetail(data);
    })();
  }, []);
}
