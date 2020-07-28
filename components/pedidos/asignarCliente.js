import React, { Fragment, useState, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../context/pedidos/PedidoContext";
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
const AsignarCliente = () => {
  // const [cliente, setCliente] = useState();
  const { agregarCliente } = useContext(PedidoContext);
  const { data, loading } = useQuery(OBTENER_CLIENTES_VENDEDOR);
  if (loading) return "cargando...";
  return (
    <Fragment>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        1.- Asigna un Cliente al Pedido
      </p>

      <Select
        className="mt-3"
        options={data.obtenerClientesVendedor}
        onChange={(opcion) => {
          agregarCliente(opcion);
          // setCliente(opcion);
        }}
        getOptionLabel={(item) => `${item.nombre} ${item.apellido}`}
        getOptionValue={(item) => item.id}
        noOptionsMessage={() => "No hay clientes"}
      />
    </Fragment>
  );
};

export default AsignarCliente;
