import React, { useState, useContext } from "react";
import Layout from "../components/layout";
/**Forms */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as Yup from "yup";

/**Apollo */
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { route } from "next/dist/next-server/server/router";

import { AuthContext } from "../components/context";

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
  // const {setToken}=useContext(AuthContext)
  const [mensaje, setMensaje] = useState(null);
  const router = useRouter();
  const yup = Yup.object({
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
    password: Yup.string().required("El password no puede ir vacio"),
  });
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(yup),
  });
  const onSubmit = async (valores) => {
    try {
      setMensaje("Autenticando ...");
      const { data } = await autenticarUsuario({
        variables: {
          input: {
            ...valores,
          },
        },
      });
      /**Guatdar el token */
      setTimeout(() => {
        const {
          autenticarUsuario: { token },
        } = data;
        // setToken(token)
        localStorage.setItem("token", token);
      }, 1000);
      setMensaje(null);
      router.push("/");
    } catch (error) {
      console.log(error);
      setMensaje(error.message);
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };
  const mostrarMensaje = () => (
    <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
      <p>{mensaje}</p>
    </div>
  );
  return (
    <Layout>
      <h1 className="text-center text-2xl font-light text-white">Login</h1>
      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5 mb-0">
        <div className="w-full max-w-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                ref={register}
                name="email"
                type="email"
                placeholder="Email usuario"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {errors.email && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{errors.email.message}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                ref={register}
                name="password"
                type="password"
                placeholder="****"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {errors.password && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{errors.password.message}</p>
              </div>
            )}
            <input
              type="submit"
              className="bg-gray-800  w-full mt-5 p-2  text-white uppercase hover:bg-gray-900"
              value="Iniciar Sesión"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
