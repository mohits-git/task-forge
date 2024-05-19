import Loading from "@/components/global/loading";
import React from "react";

type Props = {

}

const Page: React.FC<Props> = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Agency Id Page
      <Loading />
    </main>
  )
}

export default Page
