import { Resolver, Query } from 'type-graphql';

@Resolver()
export class ByeResolver {
  @Query(() => String)
  bye() {
    return 'bye rhino';
  }
}