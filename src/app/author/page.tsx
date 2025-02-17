"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthorApiService, { type Author } from "@/services/author.service";
import { EAppRouter } from "@/constants/app-router.enum";

export default function AuthorPage() {
  const [data, setData] = useState<Author[]>([]);

  useEffect(() => {
    (async () => {
      const { dataPart } = await AuthorApiService.getAll();
      setData(dataPart.data);
    })();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Search Bar */}
      <div className="flex items-center justify-between pb-4">
        <Input placeholder="Search authors..." value={""} onChange={(e) => {}} className="w-1/3" />
        <Button variant="default">Add Author</Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableCell className="px-6 py-3 font-semibold text-gray-700">STT</TableCell>
              <TableCell className="px-6 py-3 font-semibold text-gray-700">Tên tác giả</TableCell>
              <TableCell className="px-6 py-3 font-semibold text-gray-700">Thời gian tạo</TableCell>
              <TableCell className="px-6 py-3 font-semibold text-gray-700">
                Thời gian cập nhật
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((author: Author, index: number) => (
              <TableRow
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors duration-200`}
              >
                <TableCell className="px-6 py-4">{author.id}</TableCell>
                <TableCell className="px-6 py-4">
                  {/* go to detail page */}
                  <Link
                    href={`${EAppRouter.AUTHOR_PAGE}/${author.id}`}
                  >{`${author.first_name} ${author.last_name}`}</Link>
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">{author.created_at}</TableCell>
                <TableCell className="px-6 py-4 text-gray-600">{author.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-4">
        <span className="text-gray-600">
          Showing 1 - {data.length} of {data.length} results
        </span>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
