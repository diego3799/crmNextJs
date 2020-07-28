import React, { useContext, useEffect } from "react";
import Layout from "../components/layout";
import AsignarCliente from "../components/pedidos/asignarCliente";
import AsignarProductos from "../components/pedidos/asignarProductos";
import ResumenPedido from "../components/pedidos/resumenPedido";
import Total from "../components/pedidos/total";
import PedidoContext from "../components/context/pedidos/PedidoContext";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
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
const NuevoPedio = () => {
  const {
    cliente,
    total,
    productos,
    agregarCliente,
    agregarProductos,
    actualizarTotal,
  } = useContext(PedidoContext);
  const router = useRouter();
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
        },
      });
    },
  });
  const validarPedido = () => {
    return !productos.every((item) => item.cantidad > 0) ||
      total === 0 ||
      Object.keys(cliente).length === 0
      ? "opacity-50 cursor-not-allowed"
      : "";
  };
  const crearNuevoPedido = async () => {
    let pediddoFinal = [];
    for await (let item of productos) {
      pediddoFinal.push({
        id: item.id,
        cantidad: item.cantidad,
        nombre: item.nombre,
        precio: item.precio,
      });
    }
    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: cliente.id,
            total,
            pedido: pediddoFinal
          },
        },
      });
      // console.log(data);
      router.push("/pedidos");
      Swal.fire("Correcto", "El pedido se registro correctamente", "success");
    } catch (error) {
      console.log(error);
      Swal.fire("Error", error.message, "error");
    }
  };
  useEffect(() => {
    return () => {
      agregarCliente({});
      agregarProductos([]);
      actualizarTotal(0);
    };
  }, []);
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
      <div className="flex justify-center mt-5 ">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />
          <button
            onClick={crearNuevoPedido}
            type="button"
            className={`bg-gray-800  w-full mt-5 p-2  text-white uppercase  font-bold hover:bg-gray-900 ${validarPedido()}`}
          >
            Registrar pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoPedio;
