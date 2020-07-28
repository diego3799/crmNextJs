import React, { Fragment, useContext } from "react";
import PedidoContext from "../context/pedidos/PedidoContext";
import ProductoResumen from "./productoResumen";

const ResumenPedido = () => {
  const { productos } = useContext(PedidoContext);
  // console.log(productos);
  return (
    <Fragment>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        3.- Ajusta las cantidades del producto
      </p>
      {productos.length > 0 ? (
        <Fragment>
          {productos.map((item) => (
            <ProductoResumen producto={item} key={item.id} />
          ))}
        </Fragment>
      ) : (
        <Fragment>
          <p className="mt-5 text-sm">Aún no hay productos</p>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResumenPedido;
