"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "@/app/not-found";
import { BookOpen, CalendarDays, Tag, Edit, Trash2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookServiceApi, { TBook } from "@/services/book.service";
import { EAppRouter } from "@/constants/app-router.enum";
import { AppHeader } from "@/components/common/app-header";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [bookDetail, setBookDetail] = useState<TBook>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getBookDetail(): Promise<void> {
      try {
        setIsLoading(true);
        const { dataPart } = await BookServiceApi.getById(id);
        setBookDetail(dataPart);
      } catch (error) {
        console.error("Error fetching book detail:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getBookDetail();
  }, [id]);

  const handleEdit = () => {
    router.push(`${EAppRouter.BOOK_MANAGEMENT_EDIT_PAGE}/${id}`);
  };

  const handleDelete = () => {
    console.log("Delete book:", bookDetail?.title);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex gap-8">
            <div className="w-64 h-80 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookDetail) return <NotFound />;

  const isAvailable = bookDetail.quantity && bookDetail.quantity > 0;
  const stockStatus = bookDetail.quantity || 0;

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Chi tiết sách" sub_title="Thông tin chi tiết và quản lý sách" />
      {/* Header */}
      <div className="flex items-center justify-end p-6 border-b">
        <div className="flex gap-2">
          <Button onClick={handleEdit} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Xóa sách
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex gap-8">
          {/* Book Cover */}
          <div className="w-98 flex-shrink-0">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={String(bookDetail.image_url)}
                alt={`Bìa sách ${bookDetail.title}`}
                className="object-cover rounded-lg border"
                fill
                priority
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{bookDetail.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                {bookDetail.genre?.name && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{bookDetail.genre.name}</Badge>
                )}
                <Badge variant={isAvailable ? "default" : "destructive"}>{isAvailable ? "Có sẵn" : "Hết sách"}</Badge>
              </div>
            </div>

            {/* Price and Stock Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Giá trị sách</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {bookDetail.price ? `${bookDetail.price.toLocaleString("vi-VN")}₫` : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Số lượng còn lại</p>
                  <p className="text-2xl font-bold text-blue-700">{stockStatus} cuốn</p>
                </div>
              </div>
            </div>

            {/* Publishing Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Thông tin xuất bản
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Mã ISBN</p>
                      <p className="font-medium">{bookDetail.ISBN || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Số trang</p>
                      <p className="font-medium">{bookDetail.total_page || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Nhà xuất bản</p>
                      <p className="font-medium">{bookDetail.publisher?.name || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày xuất bản</p>
                      <p className="font-medium">{bookDetail.publish_date || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Mô tả</TabsTrigger>
                <TabsTrigger value="details">Chi tiết</TabsTrigger>
                <TabsTrigger value="history">Lịch sử</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Mô tả nội dung</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {bookDetail.description || "Chưa có mô tả cho cuốn sách này. Có thể chỉnh sửa để thêm mô tả."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-4">
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Thông tin chi tiết</h4>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h5 className="font-medium mb-3">Thông tin xuất bản</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Mã ISBN:</span>
                          <span>{bookDetail.ISBN || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Nhà xuất bản:</span>
                          <span>{bookDetail.publisher?.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Ngày xuất bản:</span>
                          <span>{bookDetail.publish_date || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Số trang:</span>
                          <span>{bookDetail.total_page || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-3">Thông tin quản lý</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Thể loại:</span>
                          <span>{bookDetail.genre?.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Số lượng:</span>
                          <span>{stockStatus} cuốn</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Giá trị:</span>
                          <span>{bookDetail.price ? `${bookDetail.price.toLocaleString("vi-VN")}₫` : "N/A"}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Trạng thái:</span>
                          <Badge variant={isAvailable ? "default" : "destructive"} className="text-xs">
                            {isAvailable ? "Có sẵn" : "Hết sách"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Lịch sử mượn trả</h4>
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có lịch sử mượn trả cho cuốn sách này.</p>
                    <p className="text-sm mt-2">Lịch sử sẽ được hiển thị khi có người mượn sách.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
