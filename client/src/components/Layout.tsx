import React, { FC } from "react";
import Wrapper, { WrapperVariant } from "./Wrapper";
import NavBar from "./NavBar";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
