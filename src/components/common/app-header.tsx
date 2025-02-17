"use client";

type Props = {
  title: string;
  sub_title?: string;
};

export default function AppHeader({ title, sub_title }: Props) {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 px-8 shadow-md">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {sub_title && (
          <h2 className="text-lg md:text-xl font-light mt-2 opacity-90">{sub_title}</h2>
        )}
      </div>
    </header>
  );
}
