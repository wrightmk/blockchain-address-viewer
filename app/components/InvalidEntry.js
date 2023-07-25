import React from "react";

export default function InvalidEntry({ text }) {
  return (
    <main className="flex items-center w-full justify-center h-screen">
      <h1 className="text-5xl">{text}</h1>
    </main>
  );
}
