import { Box, Heading } from "@chakra-ui/core";
import React from "react";

import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { getPostFromURL } from "../../utils/getPostFromURL";
import { withApollo } from "../../utils/withApollo";

const Post = ({}) => {
  const { data, loading, error } = getPostFromURL();

  if (loading) {
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

  const { title, text, id, creator } = data.post;

  return (
    <Layout>
      <Heading mb={4}>{title}</Heading>
      <Box mb={4}>{text}</Box>
      <EditDeletePostButtons postId={id} creatorId={creator.id} />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
