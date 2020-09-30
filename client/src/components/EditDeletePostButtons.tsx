import { IconButton, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import React, { FC } from "react";

import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  postId: number;
  creatorId: number;
}

export const EditDeletePostButtons: FC<EditDeletePostButtonsProps> = ({
  postId,
  creatorId,
}) => {
  const { data } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (data?.me?.id !== creatorId) {
    return null;
  }

  return (
    <>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
        <IconButton as={Link} mr={4} icon="edit" aria-label="Edit Post" />
      </NextLink>
      <IconButton
        icon="delete"
        aria-label="Delete Post"
        onClick={() =>
          deletePost({
            variables: { id: postId },
            update: (cache) => {
              cache.evict({ id: `Post:${postId}` });
            },
          })
        }
      />
    </>
  );
};
