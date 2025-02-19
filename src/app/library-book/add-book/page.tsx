"use client";

import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppHeader from "@/components/common/app-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// define object schema
const formSchema = z.object({
  title: z.string().min(5, "Tối thiểu ít nhất 5 ký tự").max(50, "Tối đa 50 ký tự"),
  ISBN: z.string(),
  price: z.number().min(1),
  total_page: z.number().min(1).max(1000),
  quantity: z.number().min(1).max(1000),
  publish_date: z.string(),
  description: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

export default function AddBook() {
  const form: UseFormReturn<FormValues> = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      ISBN: "",
      price: undefined,
      total_page: undefined,
      quantity: undefined,
      publish_date: "", // Defaults to today
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-lg">
      <AppHeader title="Thêm sách" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">📖 Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tiêu đề sách"
                    {...field}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ISBN */}
          <FormField
            control={form.control}
            name="ISBN"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">📑 ISBN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập ISBN (nếu có)"
                    {...field}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">💲 Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập giá"
                    {...field}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Pages */}
          <FormField
            control={form.control}
            name="total_page"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">📄 Total Pages</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Số trang"
                    {...field}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">🔢 Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Số lượng"
                    {...field}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Publish Date */}
          <FormField
            control={form.control}
            name="publish_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">📅 Publish Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">📝 Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả sách"
                    {...field}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600 text-white py-3 rounded-lg shadow-md text-lg font-semibold transition-all"
          >
            📤 Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
