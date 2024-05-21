import React, { ReactNode } from "react";

type Props = {
  children: ReactNode,
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <main>
      {children}
    </main>
  )
}

export default Layout
