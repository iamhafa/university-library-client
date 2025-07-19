// src/components/forms/borrowing-items.form.tsx
"use client";

import { FC, useEffect, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ErrorMessage } from "@/components/errors/error-message";
import { TBorrowingItemsFormValues, borrowingItemsFormSchema } from "@/schemas/borrowing-form.schema";
import { BorrowingItemsService, TBorrowingItems } from "@/services/borrowing-items.service";
import BookApiService, { type TBook } from "@/services/book.service";
import { currencyFormat } from "@/helpers/currency.format";

type Props = {
  borrowingItems: TBorrowingItemsFormValues[];
  setBorrowingItems: (items: TBorrowingItemsFormValues[]) => void;
  borrowingId?: string;
  disabled?: boolean;
};

// Loading Button Component
const LoadingButton: FC<{ loading?: boolean; children: React.ReactNode; [key: string]: any }> = ({
  loading = false,
  children,
  ...props
}) => (
  <Button {...props} disabled={props.disabled || loading}>
    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
    {loading ? "Đang xử lý..." : children}
  </Button>
);

export const BorrowingItemsForm: FC<Props> = ({ borrowingItems, setBorrowingItems, borrowingId, disabled = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [bookOptions, setBookOptions] = useState<TBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TBorrowingItemsFormValues>({
    resolver: zodResolver(borrowingItemsFormSchema),
    defaultValues: {
      book_id: undefined,
      quantity: 1,
      price: 0,
    },
  });

  // Fetch books for selection
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true);
        const { dataPart: books } = await BookApiService.getAll({});

        setBookOptions(books.data || []);
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
          setItemsLoading(true);
          const { dataPart: items, error } = await BorrowingItemsService.getByBorrowingId(borrowingId);

          if (error) {
            console.error("Error fetching existing borrowing items:", error);
            return;
          }

          // Convert existing items to form values
          const formItems: TBorrowingItemsFormValues[] = items.map((item: TBorrowingItems) => ({
            id: item.id,
            book_id: item.book_id,
            quantity: item.quantity,
            price: item.price,
            returned_date: item.returned_date,
          }));

          setBorrowingItems(formItems);
        } catch (error) {
          console.error("Error fetching existing borrowing items:", error);
        } finally {
          setItemsLoading(false);
        }
      }
    };

    fetchExistingItems();
  }, [borrowingId, setBorrowingItems]);

  // Check if book is already added
  const isBookAlreadyAdded = (bookId: number, currentIndex?: number): boolean => {
    return borrowingItems.some((item, index) => item.book_id === bookId && index !== currentIndex);
  };

  const handleInvalidAddItem = (errors: FieldErrors<TBorrowingItemsFormValues>): void => {
    console.error("Error adding/updating item:", errors);
    alert("Có lỗi xảy ra khi thêm/cập nhật sách!");
  };

  const handleValidAddItem = async (data: TBorrowingItemsFormValues) => {
    try {
      setFormSubmitting(true);

      // Check for duplicate books
      if (editingIndex === null && isBookAlreadyAdded(data.book_id)) {
        alert("Cuốn sách này đã được thêm vào danh sách mượn!");
        return;
      }

      if (editingIndex !== null) {
        // Update existing item
        const updatedItems = [...borrowingItems];
        updatedItems[editingIndex] = data;
        setBorrowingItems(updatedItems);
        console.log("updatedItems", updatedItems);
        console.log("borrowingItems", borrowingItems);

        setEditingIndex(null);
      } else {
        // Add new item
        setBorrowingItems([...borrowingItems, data]);
      }

      reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding/updating item:", error);
      alert("Có lỗi xảy ra khi thêm/cập nhật sách!");
    } finally {
      setFormSubmitting(false);
    }
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
    const book = borrowingItems[index];
    const bookTitle = getBookTitle(book.book_id);

    if (confirm(`Bạn có chắc chắn muốn xóa "${bookTitle}" khỏi danh sách mượn?`)) {
      const updatedItems = borrowingItems.filter((_, i) => i !== index);
      setBorrowingItems(updatedItems);
    }
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

  const calculateTotal = (): number => borrowingItems.reduce((total, item) => total + item.quantity * item.price, 0);

  // Show loading state while fetching existing items
  if (itemsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Đang tải danh sách sách...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" disabled={disabled || booksLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {booksLoading ? "Đang tải..." : "Thêm sách"}
          </Button>
        </DialogTrigger>
        <DialogDescription>Chỉnh sửa thông tin cuốn sách cho lượt mượn.</DialogDescription>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Chỉnh sửa sách" : "Thêm sách mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleValidAddItem, handleInvalidAddItem)} className="space-y-4">
            <div>
              <Label htmlFor="book_id">Chọn sách *</Label>
              <Controller
                name="book_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={booksLoading || formSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={booksLoading ? "Đang tải sách..." : "Chọn sách"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {bookOptions.map((book: TBook) => (
                          <SelectItem key={book.id} value={String(book.id)}>
                            <div className="flex flex-col">
                              <span className="font-medium">{book.title}</span>
                              <span className="text-sm text-gray-500">
                                ISBN: {book.ISBN} • Giá: {currencyFormat(book.price)}
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
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input id="quantity" min="1" {...register("quantity", { valueAsNumber: true })} disabled={formSubmitting} />
              <ErrorMessage message={errors.quantity?.message} />
            </div>

            <div>
              <Label htmlFor="price">Giá thuê *</Label>
              <Input id="price" min="0" {...register("price", { valueAsNumber: true })} disabled={formSubmitting} />
              <ErrorMessage message={errors.price?.message} />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleDialogClose} disabled={formSubmitting}>
                Hủy
              </Button>
              <LoadingButton type="submit" loading={formSubmitting}>
                {editingIndex !== null ? "Cập nhật" : "Thêm"}
              </LoadingButton>
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
                <TableRow key={`${item.book_id}-${index}`}>
                  <TableCell>
                    <div className="font-medium">{getBookTitle(item.book_id)}</div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{currencyFormat(item.price)}</TableCell>
                  <TableCell className="font-medium">{currencyFormat(item.quantity * item.price)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(index)}
                        disabled={disabled}
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(index)}
                        disabled={disabled}
                        title="Xóa"
                      >
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
              <span className="font-medium">Tổng cộng ({borrowingItems.length} cuốn sách):</span>
              <span className="text-lg font-bold">{currencyFormat(calculateTotal())}</span>
            </div>
          </div>
        </div>
      )}

      {borrowingItems.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="space-y-2">
            <p>Chưa có sách nào được thêm vào danh sách mượn.</p>
            <p className="text-sm">Nhấn nút "Thêm sách" để bắt đầu.</p>
          </div>
        </div>
      )}
    </div>
  );
};
