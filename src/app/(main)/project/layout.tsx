import React, { ReactNode } from "react";

type Props = {
  children: ReactNode,
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {children}
    </main>
  )
}

export default Layout
