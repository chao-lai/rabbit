import React, { FC, useState } from "react";
import { CorePostFragment, useVoteMutation } from "../generated/graphql";
import { Flex, IconButton } from "@chakra-ui/core";

type loadingState = "updoot-loading" | "downdoot-loading" | "not-loading";

interface UpdootSectionProps {
  post: CorePostFragment;
}

export const UpdootSection: FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<loadingState>('not-loading')
  const [, vote] = useVoteMutation()
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState('updoot-loading')
          await vote({
            postId: post.id,
            value: 1
          })
          setLoadingState('not-loading')
        }}
        isLoading={loadingState === 'updoot-loading'}
        aria-label="updoot post"
        icon='chevron-up'
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setLoadingState('downdoot-loading')
          await vote({
            postId: post.id,
            value: -1
          })
          setLoadingState('not-loading')
        }}
        isLoading={loadingState === 'downdoot-loading'}
        aria-label="downdoot post"
        icon='chevron-down'
      />

    </Flex>
  )
};
