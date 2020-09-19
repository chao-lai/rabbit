import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";

import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

type cursorType = null | string;

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as cursorType,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  return (
    <Layout>
      <Flex align="center">
        <Heading>Rabbit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">create a post</Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <h2>Loading...</h2>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={post} />
              <Box>
                <Heading fontSize="xl">{post.title}</Heading>
                <Text>posted by {post.creator.username}</Text>
                <Text mt={4}>
                  {post.textSnippet + (post.text.length > 49 ? "..." : "")}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data?.posts.hasMore && (
        <Flex>
          <Button
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
