"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "@/app/not-found";
import { BookOpen, CalendarDays, Landmark, ShoppingCart, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import BookServiceApi, { Book } from "@/services/book.service";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<Book>();

  useEffect(() => {
    async function getBookDetail(): Promise<void> {
      const { dataPart } = await BookServiceApi.getById(id);

      setBookDetail(dataPart);
    }

    getBookDetail();
  }, []);

  if (!bookDetail) return <NotFound />;
  else {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Phần ảnh bìa */}
          <div className="md:col-span-1 p-4 md:p-6 bg-muted/40 flex items-center justify-center">
            <AspectRatio ratio={3 / 4} className="w-full max-w-xs mx-auto">
              <Image
                src={bookDetail.image_url} // Sử dụng coverImage, có fallback
                alt={`Bìa sách ${bookDetail.title}`}
                className="object-cover rounded-md"
                fill
                priority
              />
            </AspectRatio>
          </div>

          {/* Phần thông tin chính */}
          <div className="md:col-span-2 p-4 md:p-6 flex flex-col">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl md:text-4xl font-bold">{bookDetail.title}</CardTitle>
              {/* <CardDescription className="text-lg text-muted-foreground mt-1">
                Thể loại: <span className="font-semibold text-primary">{bookDetail.genre?.name ?? "Chưa rõ"}</span>
              </CardDescription> */}
            </CardHeader>
            {bookDetail.genre?.name && (
              <div className="flex space-x-2 mb-6">
                <Badge>{bookDetail.genre.name}</Badge>
              </div>
            )}

            <div className="mb-4">
              <p className="text-3xl font-bold text-primary">
                {bookDetail.price ? bookDetail.price.toLocaleString("vi-VN") : "N/A"}₫
              </p>
              {/* Nếu có giá khuyến mãi, bạn có thể thêm logic hiển thị ở đây */}
            </div>

            <div className="mb-6 space-y-2 text-sm">
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                <span>ISBN: {bookDetail.ISBN || "Chưa rõ"}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                <span>Số trang: {bookDetail.total_page || "Chưa rõ"}</span>
              </div>
              <div className="flex items-center">
                <Landmark className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                <span>Nhà xuất bản: {bookDetail.publisher?.name || "Chưa rõ"}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                <span>Ngày xuất bản: {bookDetail.publish_date}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button size="lg" className="flex-grow md:flex-grow-0" disabled={!bookDetail.quantity || bookDetail.quantity <= 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {bookDetail.quantity && bookDetail.quantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
              </Button>
            </div>
            {bookDetail.quantity && bookDetail.quantity > 0 ? (
              <p className="text-sm text-green-600">Còn {bookDetail.quantity} sản phẩm</p>
            ) : (
              <p className="text-sm text-red-600 font-semibold">Sản phẩm hiện đã hết hàng</p>
            )}

            <Separator className="my-6" />

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <Card>
                  <CardContent className="prose prose-sm max-w-none py-4">
                    {/* Đảm bảo description là một string an toàn để render, nếu là HTML, bạn cần xử lý XSS */}
                    <p>{bookDetail.description || "Chưa có mô tả cho sản phẩm này."}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
