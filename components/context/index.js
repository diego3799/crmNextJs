import React, { createContext, useState } from "react";

/**Apollo configuration */
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "apollo-link-context";

export const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const httpLink = createHttpLink({
    uri: "http://localhost:4000/",
  });

  console.log("render inecesario");

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: token?`Bearer ${token}`:"",
      },
    };
  });
  const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          setToken,
          token
        }}
      >
        {children}
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

export default AuthProvider;
