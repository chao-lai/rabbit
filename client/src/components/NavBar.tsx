import { Box, Button, Flex, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import React, { FC } from "react";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const displayBody = (): JSX.Element | null => {
    return fetching ? null : !data?.me ? (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    ) : (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          isLoading={logoutFetching}
          onClick={() => logout()}
        >
          logout
        </Button>
      </Flex>
    );
  };

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" p={4}>
      <Box ml={"auto"}>{displayBody()}</Box>
    </Flex>
  );
};

export default NavBar;
