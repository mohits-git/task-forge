import React from "react";
import Loading from "@/components/global/loading";

const LoadingPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <Loading />
    </main>
  )
}

export default LoadingPage;
