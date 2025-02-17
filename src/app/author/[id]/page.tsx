"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader } from "@/ui/card";
import AuthorApiService, { Author } from "@/services/author.service";

export default function AuthorDetail() {
  const { id } = useParams<{ id: string }>();
  const [authorDetail, setAuthorDetail] = useState<Author>();

  useEffect(() => {
    (async () => {
      const { dataPart } = await AuthorApiService.getOneById(id);
      setAuthorDetail(dataPart);
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div>{authorDetail?.first_name}</div>
      </CardHeader>
    </Card>
  );
}
