import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";

import InputField from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { getIdFromQuery } from "../../../utils/getIDfromQuery";
import { getPostFromURL } from "../../../utils/getPostFromURL";

const EditPost = () => {
  const router = useRouter();
  const postId = getIdFromQuery();
  const [{ data, fetching, error }] = getPostFromURL();
  const [, updatePost] = useUpdatePostMutation();

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

  const { title, text } = data.post;

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title,
          text,
        }}
        onSubmit={async (values) => {
          await updatePost({ id: postId, input: values });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                placeholder="text..."
                name="text"
                label="Text"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
