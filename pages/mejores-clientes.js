import React from "react";
import Layout from "../components/layout";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { gql, useQuery } from "@apollo/client";
const MEJORES_CLIENTES = gql`
  query mejoresClientes {
    mejoresClientes {
      total
      cliente {
        nombre
        empresa
      }
    }
  }
`;

const MejoresClientes = () => {
  const { loading, error, data } = useQuery(MEJORES_CLIENTES, {
    pollInterval: 500,
  });

  if (loading) return "Cargando...";
  const { mejoresClientes } = data;
  let clienteGrafica = [];
  mejoresClientes.map((cliente, i) => {
    clienteGrafica[i] = {
      ...cliente.cliente[0],
      total: cliente.total,
    };
  });
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Mejores Clientes</h1>
      <ResponsiveContainer width={"99%"} height={550}>
        <BarChart
          width={600}
          height={500}
          data={clienteGrafica}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="total" fill="#3182ce" />
          {/* <Bar yAxisId="right" dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default MejoresClientes;
