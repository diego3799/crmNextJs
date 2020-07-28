import React from "react";
import Layout from "../components/layout";
import { gql, useQuery } from "@apollo/client";
import Producto from "../components/producto";
import Link from "next/link";

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      existencia
      precio
      creado
    }
  }
`;
const Productos = () => {
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
      <Link href="/nuevo-producto">
        <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white uppercase font-bold hover:bg-gray-800 hover:text-gray-200  rounded text-sm">
          Nuevo Producto
        </a>
      </Link>
      {loading ? (
        <p>"Cargando"</p>
      ) : (
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Existencia</th>
              <th className="w-1/5 py-2">Precio</th>
              <th className="w-1/5 py-2">Eliminar</th>
              <th className="w-1/5 py-2">Editar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.obtenerProductos.map((item) => (
              <Producto key={item.id} producto={item} />
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default Productos;
