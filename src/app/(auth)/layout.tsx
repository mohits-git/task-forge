import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            {children}
        </div>
    )
}

export default Layout
