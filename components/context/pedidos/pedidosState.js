import React, { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./pedidoReducer";
import {
  SELECCIONAR_CLIENTE,
  CANTIDAD_PRODUCTOS,
  SELECCIONAR_PRODUCTO,
  ACTUALIZAR_TOTAL,
} from "../../types";
const PedidoState = ({ children }) => {
  const initialState = {
    cliente: {},
    productos: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(PedidoReducer, initialState);
  /**Modifica el cliente */
  const agregarCliente = (cliente) => {
    dispatch({ type: SELECCIONAR_CLIENTE, payload: cliente });
  };
  const agregarProductos = (productosSeleccionado) => {
    let nuevoState;
    if (state.productos.length > 0) {
      nuevoState = productosSeleccionado.map((item) => {
        const nuevoObjeto = state.productos.find(
          (ProductoState) => ProductoState.id === item.id
        );
        return {
          ...item,
          ...nuevoObjeto,
        };
      });
    } else {
      nuevoState = productosSeleccionado;
    }
    dispatch({ type: SELECCIONAR_PRODUCTO, payload: nuevoState });
  };
  const cantidadProductos = (nuevoProducto) => {
    dispatch({ type: CANTIDAD_PRODUCTOS, payload: nuevoProducto });
  };
  const actualizarTotal = () => {
    dispatch({ type: ACTUALIZAR_TOTAL });
  };
  return (
    <PedidoContext.Provider
      value={{
        productos: state.productos,
        total: state.total,
        cliente: state.cliente,
        agregarCliente,
        agregarProductos,
        cantidadProductos,
        actualizarTotal,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;
