import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api-eu-central-1.graphcms.com/v2/ckxrm7ahg171i01z1bcgq9bw4/master",
    cache: new InMemoryCache(),
});

export default client;