import React, { Fragment, useContext, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Select from "react-select";
import PedidoContext from "../context/pedidos/PedidoContext";
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
const AsignarProductos = () => {
  const { data, loading } = useQuery(OBTENER_PRODUCTOS, {
    pollInterval: 60000,
  });
  const [selected, setSelected] = useState([]);
  // console.log(data,loading);
  const { agregarProductos } = useContext(PedidoContext);
  return (
    <Fragment>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- Selecciona o busque el producto
      </p>
      {loading ? (
        "Cargando..."
      ) : (
        <Select
          value={selected}
          isMulti
          className="mt-3"
          options={data.obtenerProductos}
          onChange={(opcion) => {
            // console.log(opcion);
            setSelected(opcion);
            if (opcion) agregarProductos(opcion);
            else agregarProductos([]);
          }}
          getOptionLabel={(item) =>
            `${item.nombre}- ${item.existencia} Disponibles`
          }
          getOptionValue={(item) => item.id}
          noOptionsMessage={() => "No hay clientes"}
        />
      )}
    </Fragment>
  );
};

export default AsignarProductos;
