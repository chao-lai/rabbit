import { Box, Heading } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";

import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { getPostFromURL } from "../../utils/getPostFromURL";

const Post = ({}) => {
  const [{ data, fetching, error }] = getPostFromURL();

  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  const {title, text, id, creator} = data.post

  return (
    <Layout>
      <Heading mb={4}>{title}</Heading>
      <Box mb={4}>{text}</Box>
      <EditDeletePostButtons
        postId={id}
        creatorId={creator.id}
      />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
