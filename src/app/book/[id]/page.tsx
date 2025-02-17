"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
}
