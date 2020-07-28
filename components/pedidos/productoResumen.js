import React, { useContext } from "react";
import PedidoContext from "../context/pedidos/PedidoContext";
const ProductoResumen = ({ producto }) => {
  const { nombre, precio } = producto;
  const { cantidadProductos, actualizarTotal } = useContext(PedidoContext);
  return (
    <div className="flex md:justify-between md:items-center mt-5">
      <div className="md:w-2/4 mb-2 md:mb-0">
        <p className="text-sm">{nombre}</p>
        <p className="text-sm">${precio}</p>
      </div>
      <input
        className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none  focus:shadow-outline md:ml-4"
        type="number"
        placeholder="Cantidad"
        onChange={(e) => {
          cantidadProductos({ ...producto, cantidad: Number(e.target.value) });
          actualizarTotal();
        }}
      />
    </div>
  );
};

export default ProductoResumen;
