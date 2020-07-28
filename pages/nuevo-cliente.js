import React, { useState } from "react";
import Layout from "../components/layout";

/**Forms */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as Yup from "yup";

/**Apollo */
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";

const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput) {
    nuevoCliente(input: $input) {
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;

const OBTENER_CLIENTES = gql`
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

const NuevoCliente = () => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
    update(cache, { data: { nuevoCliente } }) {
      /**Obtener el objeto de cache que queremos actualizar */
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES,
      });
      /**La unica manera para update al cache */
      cache.writeQuery({
        query: OBTENER_CLIENTES,
        data: {
          obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente],
        },
      });
    },
  });
  const yup = Yup.object({
    nombre: Yup.string().required("El nombre del cliente es obligatorio"),
    apellido: Yup.string().required("El apellido del cliente es obligatorio"),
    empresa: Yup.string().required("La empresa del cliente es obligatoria"),
    email: Yup.string()
      .email("Email no valido")
      .required("El email es obligatorio"),
  });
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(yup),
  });
  const onSubmit = async (info) => {
    try {
      const { data } = await nuevoCliente({
        variables: {
          input: {
            ...info,
          },
        },
      });
      // console.log(data);
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
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 "
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                ref={register}
                name="nombre"
                type="text"
                placeholder="Nombre del cliente"
                id="nombre"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {errors.nombre && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{errors.nombre.message}</p>
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
                ref={register}
                name="apellido"
                type="text"
                placeholder="Apellido del cliente"
                id="apellido"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {errors.apellido && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{errors.apellido.message}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="empresa"
              >
                Empresa
              </label>
              <input
                ref={register}
                name="empresa"
                type="text"
                placeholder="Empresa del cliente"
                id="empresa"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {errors.empresa && (
              <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{errors.empresa.message}</p>
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
                ref={register}
                name="email"
                type="text"
                placeholder="Email del cliente"
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
                htmlFor="telefono"
              >
                Telefono
              </label>
              <input
                ref={register}
                name="telefono"
                type="tel"
                placeholder="Teléfono del cliente"
                id="telefono"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <input
              value="Registrar Cliente"
              type="submit"
              className="bg-gray-800 w-full py-2 mt-5 text-white uppercase font-bold hover:bg-gray-900"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoCliente;
