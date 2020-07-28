import React, { useContext, Fragment } from "react";
import { useQuery, gql } from "@apollo/client";
import { AuthContext } from "./context";
import { useRouter } from "next/router";
import client from "../config/apollo";
const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      nombre
      apellido
    }
  }
`;

const Header = () => {
  const router = useRouter();
  if(!localStorage.getItem('token')) {
    router.push('/login');
  }
  const cerrarSesion = () => {
    // setToken("");
    localStorage.removeItem("token");
    client.resetStore();
    router.push("/login");
  };
  // const { setToken } = useContext(AuthContext);
  const { data, loading, error } = useQuery(OBTENER_USUARIO);
  if (loading) return null;
  if (!data || (data && !data.obtenerUsuario)) return router.push("/login");

  return (
    <div className="sm:flex sm:justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0">
        Hola:
        {`${data.obtenerUsuario.nombre} ${data.obtenerUsuario.apellido}`}
      </p>
      <button
        onClick={cerrarSesion}
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
