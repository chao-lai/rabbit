import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";

import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 49);
  }

  @FieldResolver(() => User)
  async creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return await userLoader.load(post.creatorId);
  }

  @FieldResolver(() => Number)
  async voteStatus(
    @Root() post: Post,
    @Ctx() { updootLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }
    const updoot = await updootLoader.load({
      userId: req.session.userId,
      postId: post.id,
    });
    return updoot ? updoot.value : 0;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    const updoot = await Updoot.findOne({ where: { postId, userId } });

    if (value === 0 || updoot?.value === value) {
      return false;
    }

    if (updoot) {
      await getConnection().transaction(async (tx) => {
        await tx.query(
          `
          update updoot
          set value = value + $1
          where "postId" = $2 and "userId" = $3
          `,
          [value, postId, userId]
        );

        await tx.query(
          `
          update post
          set points = points + $1
          where id = $2
          `,
          [value, postId]
        );
      });
    } else {
      await getConnection().transaction(async (tx) => {
        await tx.query(
          `
          insert into updoot ("userId", "postId", value)
          values ($1, $2, $3)
          `,
          [userId, postId, value]
        );
        await tx.query(
          `
          update post
          set points = points + $1
          where id = $2
          `,
          [value, postId]
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const hardLimit = Math.min(25, limit);

    const replacements: any[] = [hardLimit];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.*
    from post p
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1 + 1
    `,
      replacements
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .orderBy('"createdAt"', "DESC")
    //   .take(hardLimit + 1);

    // if (cursor) {
    //   qb.where('"createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, hardLimit),
      hasMore: posts.length === hardLimit + 1,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return await Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    // @Arg("title", () => String, { nullable: true }) title: string
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post | undefined> {
    const { title, text } = input;
    const res = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return res.raw[0];
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllPost(): Promise<boolean> {
    await Post.delete({});
    return true;
  }
}
