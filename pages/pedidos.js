import React from "react";
import Layout from "../components/layout";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import Pedido from "../components/pedido";

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;
const Pedidos = () => {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS,{
    pollInterval:1000
  });
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
      <Link href="nuevo-pedido">
        <a className="bg-blue-800 px-5 py-2 mt-3 text-white rounded font-bold text-sm inline-block hover:bg-gray-800  uppercase">
          Nuevo Pedido
        </a>
      </Link>
      {loading ? (
        "Cargando..."
      ) : data.obtenerPedidosVendedor.length > 0 ? (
        data.obtenerPedidosVendedor.map((item) => (
          <Pedido key={item.id} pedido={item} />
        ))
      ) : (
        <p className="mt-5 text-2xl text-center">No hay pedidos aún</p>
      )}
    </Layout>
  );
};

export default Pedidos;
