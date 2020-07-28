import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import { gql, useQuery, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
/**gql queries */
const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;
const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;

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
/**end gql queries */

const EditarCliente = () => {
  const yup = Yup.object({
    nombre: Yup.string().required("El nombre del cliente es obligatorio"),
    apellido: Yup.string().required("El apellido del cliente es obligatorio"),
    empresa: Yup.string().required("La empresa del cliente es obligatoria"),
    email: Yup.string()
      .email("Email no valido")
      .required("El email es obligatorio"),
  });
  const router = useRouter();
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
    update(cache, { data }) {
      /**Actualizacion del cache cuando entramos al [id].js */
      const { obtenerCliente } = cache.readQuery({
        query: OBTENER_CLIENTE,
        variables: {
          id: router.query.id,
        },
      });
      cache.writeQuery({
        query: OBTENER_CLIENTE,
        variables: {
          id: router.query.id,
        },
        data: {
          obtenerCliente: data.actualizarCliente,
        },
      });
      /**Actualizacion del cache cuando vamos a /index */
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_VENDEDOR,
      });
      // console.log(obtenerClientesVendedor);
      cache.writeQuery({
        query: OBTENER_CLIENTES_VENDEDOR,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.map((clientesV) => {
            if (router.query.id === clientesV.id) {
              return data.actualizarCliente;
            } else {
              return clientesV;
            }
          }),
        },
      });
    },
  });
  const { data, loading } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id: router.query.id,
    },
  });
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(yup),
  });
  const onSubmit = async (info) => {
    try {
      const { data } = await actualizarCliente({
        variables: {
          id: router.query.id,
          input: {
            ...info,
          },
        },
      });
      // console.log(data);
      Swal.fire("Actualizado", "El Cliente ha sido actualizado", "success");
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) return "Cargando...";

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
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
                defaultValue={data.obtenerCliente.nombre}
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
                defaultValue={data.obtenerCliente.apellido}
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
                defaultValue={data.obtenerCliente.empresa}
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
                defaultValue={data.obtenerCliente.email}
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
                defaultValue={data.obtenerCliente.telefono}
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

export default EditarCliente;
