import Loading from "@/components/global/loading";
import React from "react";

type Props = {

}

const Page: React.FC<Props> = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      ProjectId Page
      <Loading />
    </div>
  )
}

export default Page
