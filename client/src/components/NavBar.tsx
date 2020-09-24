import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
  const router = useRouter();
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
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
            router.reload();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  };

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>Rabbit</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{displayBody()}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
