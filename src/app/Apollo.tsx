import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  Operation,
  HttpLink,
} from "@apollo/client";
import { sselink } from "../apolloLinks/sseLink";
import { getMainDefinition } from "@apollo/client/utilities";

const checkIfOperationIsSubscription = ({ query }: Operation) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === "OperationDefinition" &&
    definition.operation === "subscription"
  );
};

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  link: split(
    checkIfOperationIsSubscription,
    sselink,
    new HttpLink({ uri: "http://localhost:3000/graphql" }),
  ),
  cache: new InMemoryCache(),
});

export default function Apollo({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
