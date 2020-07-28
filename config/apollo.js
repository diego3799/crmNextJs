import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "apollo-link-context";
const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

const authLink=setContext((_,{headers})=>{
  return {
    headers:{
      ...headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    }
  }
})
const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
