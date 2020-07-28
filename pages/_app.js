import "../css/tailwind.css";
import AuthProvider from "../components/context";
import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
import PedidoState from "../components/context/pedidos/pedidosState";
export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <PedidoState>
        {/* <AuthProvider> */}
        <Component {...pageProps} />
        {/* </AuthProvider> */}
      </PedidoState>
    </ApolloProvider>
  );
}
