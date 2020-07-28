import React from "react";
import Swal from "sweetalert2";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";

const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;
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
const Cliente = ({ item }) => {
  const router = useRouter();
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache) {
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_VENDEDOR,
      });
      cache.writeQuery({
        query: OBTENER_CLIENTES_VENDEDOR,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(
            (cliente) => cliente.id !== item.id
          ),
        },
      });
    },
  });
  const confirmarEliminarCliente = () => {
    Swal.fire({
      title: "¿Deseas eliminar a este cliente?",
      text: "Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "No, Cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await eliminarCliente({
            variables: {
              id: item.id,
            },
          });
          Swal.fire("¡Eliminado!", data.eliminarCliente, "success");
        } catch (error) {
          console.log(error);
          Swal.fire("¡Error!", error.message, "error");
        }
      }
    });
  };
  return (
    <tr key={item.id}>
      <td className="border px-4 py-2">
        {item.nombre} {item.apellido}
      </td>
      <td className="border px-4 py-2">{item.empresa}</td>
      <td className="border px-4 py-2">{item.email}</td>
      <td className="border px-4 py-2">
        <button
          onClick={confirmarEliminarCliente}
          type="button"
          className="flex justify-center items-center bg-red-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold hover:bg-red-800"
        >
          <svg
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Eliminar
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          onClick={() =>
            router.push(`/editar-cliente/[id]`, `/editar-cliente/${item.id}`)
          }
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold hover:bg-green-800"
        >
          <svg
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          Editar
        </button>
      </td>
    </tr>
  );
};

export default Cliente;
