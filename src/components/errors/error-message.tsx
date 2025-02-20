"use client";

type Props = {
  message?: string;
};

export default function ErrorMessage({ message }: Props) {
  if (!message) return null;

  return <p className="text-red-500 text-sm">{message}</p>;
}
