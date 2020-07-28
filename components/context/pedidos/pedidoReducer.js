import {
  SELECCIONAR_CLIENTE,
  CANTIDAD_PRODUCTOS,
  SELECCIONAR_PRODUCTO,
  ACTUALIZAR_TOTAL,
} from "../../types";
export default (state, action) => {
  switch (action.type) {
    case SELECCIONAR_CLIENTE:
      return {
        ...state,
        cliente: action.payload,
      };
    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        productos: action.payload,
      };
    case CANTIDAD_PRODUCTOS:
      return {
        ...state,
        productos: state.productos.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case ACTUALIZAR_TOTAL:
      return {
        ...state,
        total: state.productos.reduce(
          (nuevoTotal, articulo) =>
            (nuevoTotal += articulo.precio * articulo.cantidad)
        ,0),
      };
    default:
      return state;
  }
};
