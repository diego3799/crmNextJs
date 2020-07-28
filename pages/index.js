import Layout from "../components/layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { Fragment } from "react";
import Cliente from "../components/cliente";
const OBTENER_CLIENTES_VENDEDOR = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
    }
  }
`;
export default function Home() {
  const router = useRouter();

  const { data, loading, error } = useQuery(OBTENER_CLIENTES_VENDEDOR);
  if (loading) return "Cargando ...";
  if (!data) {
    router.push("/login");
    return <Fragment />;
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
        <Link href="nuevo-cliente">
          <a className="bg-blue-800 px-5 py-2 mt-3 text-white rounded font-bold text-sm inline-block hover:bg-gray-800 w-full lg:w-auto text-center uppercase">
            Nuevo Cliente
          </a>
        </Link>
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2">Eliminar</th>
                <th className="w-1/5 py-2">Editar</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.obtenerClientesVendedor.map((item) => (
                <Cliente key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
}
