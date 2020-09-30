[LIVE SITE](https://aged.monster/)
[![dummy photo](https://i.imgur.com/hYy8Y6b.png)](https://aged.monster/)

# Overview

Rabbit is a fullstack web application, written in TypeScript, with simple features that resemble those of Reddit's. Users can sign up, login, and create posts. Furthermore, they can vote up or down on the posts.

## Setup 🔧

### Client

The frontend client is powered by React in Next.js and Chakra UI. Apollo is used to make queries, interact with the GraphQL server, and to paginate the posts.

1. cd to the client directory, run yarn 
2. run yarn dev

### Server

The backend server is built using PostgreSQL, Node.js, and GraphQL. Redis is used to store the user's session cookie for automatic authentication.

1. cd to the server directory, copy from .env.example and create a .env file
2. create a postgres db in your terminal: createdb [your-db-name]
3. fill out the env variables
- DATABASE_URL=postgresql://postgres:postgres@localhost:5432/[your-db-name]
- REDIS_URL=127.0.0.1:6379
- PORT=[server port number]
- SESSION_SECRET=[secret of your choice]
- CORS_ORIGIN=http://localhost:3000/
4. run yarn -> run yarn watch -> run yarn dev in a separate terminal window