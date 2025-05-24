"use client";

type Props = {
  title: string;
  sub_title?: string;
};

export default function AppHeader({ title, sub_title }: Props) {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
      <p className="text-lg text-gray-600 mt-2">{sub_title}</p>
    </header>
  );
}
