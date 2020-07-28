import React, { useState } from "react";
import Layout from "../components/layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useMutation, gql } from "@apollo/client";

const CREAR_USUARIO = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`;
const Signup = () => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState(null);
  const [nuevoUsuario] = useMutation(CREAR_USUARIO);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      apellido: Yup.string().required("El Apellido es obligatorio"),
      email: Yup.string()
        .email("El email no es válido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .required("El password no puede ir vacio")
        .min(6, "El password no puede ser menor a 6 caracteres"),
    }),
    onSubmit: async (valores) => {
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              ...valores,
            },
          },
        });
        console.log(data);
        setMensaje(
          `Se creó correctamente el usuario: ${data.nuevoUsuario.nombre}`
        );
        setTimeout(() => {
          setMensaje(null);
          router.push("/login");
        }, 3000);
      } catch (error) {
        // console.log(error);
        setMensaje(error.message);
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      }
    },
  });
  const mostrarMensaje = () => (
    <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
      <p>{mensaje}</p>
    </div>
  );

  return (
    <Layout>
      <h1 className="text-center text-2xl font-light text-white">Signup</h1>
      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                placeholder="Nombre Usuario"
                id="nombre"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Apellido
              </label>
              <input
                value={formik.values.apellido}
                onChange={formik.handleChange}
                type="text"
                placeholder="Apellido usuario"
                id="apellido"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.apellido && formik.errors.apellido && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.apellido}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                value={formik.values.email}
                onChange={formik.handleChange}
                type="email"
                placeholder="Email usuario"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
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
                value={formik.values.password}
                onChange={formik.handleChange}
                type="password"
                placeholder="****"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.password}</p>
              </div>
            )}
            <input
              type="submit"
              className="bg-gray-800  w-full mt-5 p-2  text-white uppercase hover:bg-gray-900"
              value="Crear Cuenta"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
