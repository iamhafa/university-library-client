"use client";

import { FC } from "react";

type Props = {
  title: string;
  sub_title?: string;
};

export const AppHeader: FC<Props> = ({ title, sub_title }) => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
      <p className="text-lg text-gray-600 mt-2">{sub_title}</p>
    </header>
  );
};
