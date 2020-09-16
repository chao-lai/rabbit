import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { buildSchema } from 'type-graphql';

import { __prod__, COOKIE_NAME } from './constants';
import { ByeResolver } from './resolvers/bye';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { createConnection } from 'typeorm'
import { Post } from './entities/Post';
import { User } from './entities/User';

const main = async () => {
  const connection = await createConnection({
    type: 'postgres',
    database: 'rabbit2',
    username: 'postgres',
    password: 'wooden',
    logging: true,
    synchronize: true,
    entities: [Post, User],
  });

  const app = express();

  let RedisStore = connectRedis(session);
  const redis = new Redis()

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 6, // 5 hours
        httpOnly: true,
        sameSite: "lax", //csrf
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "hidden",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ByeResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

main().catch((err) => console.error(err));
