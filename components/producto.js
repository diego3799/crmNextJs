import React from "react";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

/**gql queries */
const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;
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
/**end gql queries */
const Producto = ({ producto }) => {
  const router=useRouter()
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: obtenerProductos.filter(
            (item) => item.id !== producto.id
          ),
        },
      });
    },
  });
  const confirmarEliminarProducto = () => {
    Swal.fire({
      title: "¿Deseas eliminar a este producto?",
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
          const { data } = await eliminarProducto({
            variables: {
              id: producto.id,
            },
          });
          Swal.fire("¡Eliminado!", data.eliminarProducto, "success");
        } catch (error) {
          console.log(error);
          Swal.fire("¡Error!", error.message, "error");
        }
      }
    });
  };
  return (
    <tr>
      <td className="border px-4 py-2 text-center">{producto.nombre}</td>
      <td className="border px-4 py-2 text-center">
        {producto.existencia} Piezas
      </td>
      <td className="border px-4 py-2 text-center">$ {producto.precio}</td>
      <td className="border px-4 py-2">
        <button
          onClick={confirmarEliminarProducto}
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
              router.push(`/editar-producto/[id]`, `/editar-producto/${producto.id}`)
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

export default Producto;
