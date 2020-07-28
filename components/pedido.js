import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const ACTUALIZAR_PEDIDO = gql`
  mutation actualizarPedido($id: ID!, $input: PedidoInput) {
    actualizarPedido(id: $id, input: $input) {
      estado
    }
  }
`;

const ELIMINAR_PEDIDO = gql`
  mutation eliminarPedido($id: ID!) {
    eliminarPedido(id: $id)
  }
`;
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
const Pedido = ({ pedido }) => {
  const {
    id,
    total,
    cliente: { nombre, apellido, email, telefono },
    estado,
  } = pedido;
  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
    update(cache) {
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: obtenerPedidosVendedor.filter(
            (item) => item.id !== id
          ),
        },
      });
    },
  });
  const [clase, setClase] = useState("");
  const [estadoPedido, setEstadoPedido] = useState(estado);
  useEffect(() => {
    clasePedido();
  }, [estadoPedido]);
  const confirmarEliminarPedido = () => {
    Swal.fire({
      title: "¿Deseas eliminar a este pedido?",
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
          await eliminarPedido({
            variables: {
              id: id,
            },
          });
          Swal.fire(
            "¡Eliminado!",
            "El pedido se elimino de manera correcta",
            "success"
          );
        } catch (error) {
          console.log(error);
          Swal.fire("¡Error!", error.message, "error");
        }
      }
    });
  };
  const cambiarEstadoPedido = async (e) => {
    setEstadoPedido(e.target.value);
    try {
      const { data } = await actualizarPedido({
        variables: {
          id,
          input: {
            estado: e.target.value,
            cliente: pedido.cliente.id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const clasePedido = () => {
    switch (estadoPedido) {
      case "PENDIENTE":
        return setClase("border-yellow-500");
      case "COMPLETADO":
        return setClase("border-green-500");
      default:
        return setClase("border-red-800");
    }
  };
  return (
    <div
      className={` ${clase} border-t-4 mt-4 rounded bg-white p-6 md:grid md:grid-cols-2 md:gap-4  shadow-lg`}
    >
      <div>
        <p className="font-bold text-gray-800">
          Cliente: {nombre} {apellido}
          <span className="flex items-center my-2">
            <svg
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            {email}
          </span>
        </p>
        {telefono && (
          <p className="flex items-center my-2">
            <svg
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            {telefono}
          </p>
        )}
        <h2 className="text-gray-800 font-bold mt-10">Estado Pedido</h2>
        <select
          defaultValue={estado}
          onChange={cambiarEstadoPedido}
          className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white rounded p-2 text-center leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
        >
          <option value="COMPLETADO">COMPLETADO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
      </div>
      <div>
        <h2 className="text-gray-800 font-bold mt-2">Resumen del pedido</h2>
        {pedido.pedido.map((item) => (
          <div key={item.id} className="mt-4">
            <p className="text-sm text-gray-600"> Producto: {item.nombre}</p>
            <p className="text-sm text-gray-600"> Cantidad: {item.cantidad}</p>
          </div>
        ))}
        <p className="text-gray-800 mt-3 font-bold">
          Total a pagar: {""}
          <span className="font-light">$ {total}</span>
        </p>
        <button
          onClick={confirmarEliminarPedido}
          className="flex items-center mt-4 bg-red-600 px-5 py-2 text-white rounded  leading-tight  uppercase text-xs font-bold"
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
          Eliminar Pedido
        </button>
      </div>
    </div>
  );
};

export default Pedido;
