// components/forms/BorrowingItemsManager.tsx
"use client";

import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ErrorMessage from "@/components/errors/error-message";
import { TBorrowingItemsFormValues, borrowingItemsFormSchema } from "@/schemas/borrowing-form.schema";
import { BorrowingItemsService, TBorrowingItems } from "@/services/borrowing-items.service";
import BookApiService, { type TBook } from "@/services/book.service";

type Props = {
  borrowingItems: TBorrowingItemsFormValues[];
  setBorrowingItems: (items: TBorrowingItemsFormValues[]) => void;
  borrowingId?: number;
  disabled?: boolean;
};

export const BorrowingItemsManager: FC<Props> = ({ borrowingItems, setBorrowingItems, borrowingId, disabled = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [bookOptions, setBookOptions] = useState<TBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [existingItems, setExistingItems] = useState<TBorrowingItems[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TBorrowingItemsFormValues>({
    resolver: zodResolver(borrowingItemsFormSchema),
    defaultValues: {
      book_id: undefined,
      quantity: 1,
      price: 0,
      borrowing_id: borrowingId,
    },
  });

  const selectedBookId = watch("book_id");

  // Fetch books for selection
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true);
        const { dataPart: books } = await BookApiService.getAll({});
        setBookOptions(books.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setBooksLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Fetch existing borrowing items if in edit mode
  useEffect(() => {
    const fetchExistingItems = async () => {
      if (borrowingId) {
        try {
          const { dataPart: items } = await BorrowingItemsService.getByBorrowingId(borrowingId);
          setExistingItems(items);

          // Convert existing items to form values
          const formItems: TBorrowingItemsFormValues[] = items.map((item) => ({
            book_id: item.book_id,
            quantity: item.quantity,
            price: item.price,
            borrowing_id: item.borrowing_id,
            returned_date: item.returned_date,
          }));
          setBorrowingItems(formItems);
        } catch (error) {
          console.error("Error fetching existing borrowing items:", error);
        }
      }
    };

    fetchExistingItems();
  }, [borrowingId, setBorrowingItems]);

  // Auto-fill price when book is selected
  useEffect(() => {
    if (selectedBookId) {
      const selectedBook = bookOptions.find((book) => book.id === selectedBookId);
      if (selectedBook) {
        setValue("price", selectedBook.price || 0);
      }
    }
  }, [selectedBookId, bookOptions, setValue]);

  const handleAddItem = (data: TBorrowingItemsFormValues) => {
    if (editingIndex !== null) {
      // Update existing item
      const updatedItems = [...borrowingItems];
      updatedItems[editingIndex] = data;
      setBorrowingItems(updatedItems);
      setEditingIndex(null);
    } else {
      // Add new item
      setBorrowingItems([...borrowingItems, data]);
    }

    reset();
    setIsDialogOpen(false);
  };

  const handleEditItem = (index: number) => {
    const item = borrowingItems[index];
    setEditingIndex(index);

    // Set form values
    Object.entries(item).forEach(([key, value]) => {
      setValue(key as keyof TBorrowingItemsFormValues, value);
    });

    setIsDialogOpen(true);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = borrowingItems.filter((_, i) => i !== index);
    setBorrowingItems(updatedItems);
  };

  const getBookTitle = (bookId: number): string => {
    const book = bookOptions.find((b) => b.id === bookId);
    return book ? `${book.title} (${book.ISBN})` : `Book ID: ${bookId}`;
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingIndex(null);
    reset();
  };

  return (
    <div className="space-y-4">
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm sách
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Chỉnh sửa sách" : "Thêm sách mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddItem)} className="space-y-4">
            <div>
              <Label htmlFor="book_id">Chọn sách</Label>
              <Controller
                name="book_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={booksLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn sách" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {bookOptions.map((book: TBook) => (
                          <SelectItem key={book.id} value={String(book.id)}>
                            <div className="flex flex-col">
                              <span className="font-medium">{book.title}</span>
                              <span className="text-sm text-gray-500">
                                ISBN: {book.ISBN} • Giá: {book.price?.toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage message={errors.book_id?.message} />
            </div>

            <div>
              <Label htmlFor="quantity">Số lượng</Label>
              <Input id="quantity" type="number" min="1" {...register("quantity", { valueAsNumber: true })} />
              <ErrorMessage message={errors.quantity?.message} />
            </div>

            <div>
              <Label htmlFor="price">Giá thuê</Label>
              <Input id="price" type="number" min="0" step="0.01" {...register("price", { valueAsNumber: true })} />
              <ErrorMessage message={errors.price?.message} />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleDialogClose}>
                Hủy
              </Button>
              <Button type="submit">{editingIndex !== null ? "Cập nhật" : "Thêm"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Items Table */}
      {borrowingItems.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sách</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá thuê</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className="w-20">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowingItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{getBookTitle(item.book_id)}</div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell className="font-medium">{(item.quantity * item.price).toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleEditItem(index)} disabled={disabled}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteItem(index)} disabled={disabled}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Total Summary */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tổng cộng:</span>
              <span className="text-lg font-bold">
                {borrowingItems.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
      )}

      {borrowingItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">Chưa có sách nào được thêm. Nhấn "Thêm sách" để bắt đầu.</div>
      )}
    </div>
  );
};
