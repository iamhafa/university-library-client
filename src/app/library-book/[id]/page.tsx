"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NotFound from "@/app/not-found";
import BookServiceApi, { Book } from "@/services/book.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookDetailPage() {
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
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Chi tiết sách</h1>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <span className="font-semibold">Tên sách:</span> {bookDetail.title}
            </div>
            <div>
              <span className="font-semibold">ISBN:</span> {bookDetail.ISBN}
            </div>
            <div>
              <span className="font-semibold">Giá:</span> <Badge>{bookDetail.price}</Badge>
            </div>
            <div>
              <span className="font-semibold">Tổng số trang:</span> {bookDetail.total_page}
            </div>
            <div>
              <span className="font-semibold">Số lượng:</span> {bookDetail.quantity}
            </div>
            <div>
              <span className="font-semibold">Ngày phát hành:</span> {bookDetail.publish_date}
            </div>
            <div>
              <span className="font-semibold">Ngày tạo:</span> {bookDetail.created_at}
            </div>
            <div>
              <span className="font-semibold">Ngày cập nhật:</span> {bookDetail.updated_at}
            </div>

            <div className="pt-6">
              <Link href="/library-book">
                <Button variant="outline">Quay lại danh sách</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
