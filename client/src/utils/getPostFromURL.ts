import { usePostQuery } from "../generated/graphql";
import { getIdFromQuery } from "./getIdFromQuery";

export const getPostFromURL = () => {
  const postId = getIdFromQuery();
  return usePostQuery({
    skip: postId === -1,
    variables: {
      id: postId,
    },
  });
};
