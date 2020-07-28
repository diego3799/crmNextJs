import React from "react";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
/**Forms */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as Yup from "yup";

/**Apollo */
import { gql, useMutation, useQuery } from "@apollo/client";

import Swal from "sweetalert2";

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($input: ProductoInput, $id: ID!) {
    actualizarProducto(input: $input, id: $id) {
      id
      nombre
      existencia
      precio
    }
  }
`;
const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
      nombre
      existencia
      precio
    }
  }
`;

const EditarProducto = () => {
  const router = useRouter();
  const yup = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    existencia: Yup.number()
      .typeError("La existencia tiene que ser un numero")
      .required("La existencia es obligatoria")
      .integer("Tiene que ser un numero entero")
      .min(1, "No puedes agregar menos de 1 producto"),
    precio: Yup.number()
      .test("", "Precio invalido", (number) =>
        /^[0-9]*(\.[0-9]{0,2})?$/.test(number)
      )
      .typeError("El precio tiene que ser un numero")
      .required("El precio es obligatorio")
      .positive("El precio tiene que ser positivo"),
  });
  const { data, loading } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id: router.query.id,
    },
  });
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
    update(cache, { data: { actualizarProducto } }) {
      const { obtenerProducto } = cache.readQuery({
        query: OBTENER_PRODUCTO,
        variables: {
          id: router.query.id,
        },
      });
      cache.writeQuery({
        query: OBTENER_PRODUCTO,
        variables: {
          id: router.query.id,
        },
        data: {
          obtenerProducto: actualizarProducto,
        },
      });
    },
  });
  const { register, errors, handleSubmit } = useForm({
    mode: "onBlur",
    resolver: yupResolver(yup),
  });
  const onSubmit = async (info) => {
    try {
      const { data } = await actualizarProducto({
        variables: {
          id: router.query.id,
          input: {
            ...info,
          },
        },
      });
      Swal.fire("Creado", "Se creó el producto exitosamente", "success");
      // console.log(data);
      router.push("/productos");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          {loading ? (
            "Cargando..."
          ) : (
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
                  defaultValue={data.obtenerProducto.nombre}
                  placeholder="Nombre del producto"
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
                  htmlFor="precio"
                >
                  Precio
                </label>
                <input
                  ref={register}
                  name="precio"
                  type="money"
                  defaultValue={data.obtenerProducto.precio}
                  placeholder="$20"
                  id="precio"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {errors.precio && (
                <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{errors.precio.message}</p>
                </div>
              )}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="existencia"
                >
                  Existencia
                </label>
                <input
                  ref={register}
                  name="existencia"
                  type="number"
                  placeholder="Numero de piezas"
                  defaultValue={data.obtenerProducto.existencia}
                  id="existencia"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {errors.existencia && (
                <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{errors.existencia.message}</p>
                </div>
              )}
              <input
                value="Actualizar Producto"
                type="submit"
                className="bg-gray-800 w-full py-2 mt-5 text-white uppercase font-bold hover:bg-gray-900"
              />
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default EditarProducto;
