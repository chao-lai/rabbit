import NavBar from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>frog jump</div>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map(
          (post: {
            id: string | number | null | undefined;
            title: import("react").ReactNode;
          }) => {
            return <div key={post.id}>{post.title}</div>;
          }
        )
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
