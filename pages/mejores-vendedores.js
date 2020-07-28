import React from "react";
import Layout from "../components/layout";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { gql, useQuery } from "@apollo/client";
const MEJORES_VENDEDORES = gql`
  query mejoresVendedores {
    mejoresVendedores {
      vendedor {
        nombre
        email
      }
      total
    }
  }
`;

const MejoresVendedores = () => {
  const { loading, error, data } = useQuery(MEJORES_VENDEDORES, {
    pollInterval: 1000,
  });
  if (loading) return "Cargando...";
  const { mejoresVendedores } = data;
  let vendedorGrafica = [];
  mejoresVendedores.map((vendedor, i) => {
    vendedorGrafica[i] = {
      ...vendedor.vendedor[0],
      total: vendedor.total,
    };
  });
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Mejores Vendedores</h1>v{" "}
      <ResponsiveContainer width={"99%"} height={550}>
        <BarChart
          width={600}
          height={500}
          data={vendedorGrafica}
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

export default MejoresVendedores;
