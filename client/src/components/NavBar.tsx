import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import React, { FC } from "react";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const [logout, { loading: logoutLoading }] = useLogoutMutation();

  const displayBody = (): JSX.Element | null => {
    return loading ? null : !data?.me ? (
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
          isLoading={logoutLoading}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  };

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="#E7D7C1" p={4}>
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
