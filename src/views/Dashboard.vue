<template>
    <v-container>
      <!-- Sección superior con el gráfico combinado de mesas y productos -->
      <v-row align="stretch">
        <v-col cols="12" md="6">
          <v-card class="pa-4 same-height">
            <v-card-title class="text-center">
              Estado de Mesas
            </v-card-title>
            <v-row justify="center" class="align-items-center">
              <apexchart type="donut" :height="350" :options="chartMesasOptions" :series="chartMesasSeries" />
            </v-row>
            <v-card-subtitle class="text-center">
              Total: {{ totalMesas }} mesas
            </v-card-subtitle>
          </v-card>
        </v-col>
  
        <!-- Estado de Productos -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 same-height">
            <v-card-title class="text-center">
              Estado de Productos
            </v-card-title>
            <v-row justify="center" class="align-items-center">
              <apexchart type="donut" :height="350" :options="chartProductosOptions" :series="chartProductosSeries" />
            </v-row>
            <v-card-subtitle class="text-center">
              Total: {{ totalProductos }} productos
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Sección inferior con la tabla de productos más vendidos y el gráfico de ventas -->
      <v-row align="stretch">
        <!-- Tabla de Productos Más Vendidos -->
        <v-col cols="12" md="6">
          <v-card class="same-height pa-4">
            <v-card-title>Productos Más Vendidos</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="topProducts"
                class="elevation-1"
                hide-default-footer
                dense
                :row-height="50"
              >
                <template v-slot:item.totalSales="{ item }">
                  <v-chip color="green" dark>
                    {{ item.totalSales }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Gráfico de Ventas de Productos -->
        <v-col cols="12" md="6">
          <v-card class="same-height pa-4">
            <v-card-title>Ventas de Productos</v-card-title>
            <v-card-text>
              <apexchart type="bar" height="350" :options="chartOptions" :series="chartSeries" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>
  
  <script>
  import Vue from 'vue';
  import VueApexCharts from 'vue-apexcharts';
  
  Vue.component('apexchart', VueApexCharts);
  
  export default {
    data() {
      return {
        // Datos de las tarjetas
        totalMesas: 20, // Simulando el total de mesas
        mesasOcupadas: 12, // Simulando la cantidad de mesas ocupadas
        mesasDisponibles: 8, // Simulando la cantidad de mesas disponibles
        totalProductos: 50, // Simulando el total de productos
        productosEnPreparacion: 20, // Simulando productos en preparación
        productosDespachados: 30, // Simulando productos despachados
  
        // Datos para el gráfico de estado de mesas
        chartMesasOptions: {
          labels: ['Ocupadas', 'Disponibles'],
          colors: ['#FF4560', '#00E396'],
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              return opts.w.globals.series[opts.seriesIndex];
            },
          },
          legend: {
            position: 'bottom'
          }
        },
        chartMesasSeries: [12, 8], // Valores simulados de mesas ocupadas y disponibles
  
        // Datos para el gráfico de estado de productos
        chartProductosOptions: {
          labels: ['En Preparación', 'Despachados'],
          colors: ['#FFA500', '#008FFB'],
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              return opts.w.globals.series[opts.seriesIndex];
            },
          },
          legend: {
            position: 'bottom'
          }
        },
        chartProductosSeries: [20, 30], // Valores simulados de productos en preparación y despachados
  
        // Cabecera de la tabla de productos más vendidos
        headers: [
          { text: "Producto", value: "name" },
          { text: "Ventas Totales", value: "totalSales" },
        ],
        // Datos simulados de productos más vendidos
        topProducts: [
          { name: "Hamburguesa", totalSales: 150 },
          { name: "Pizza", totalSales: 120 },
          { name: "Pasta", totalSales: 100 },
          { name: "Ensalada", totalSales: 80 },
          { name: "Soda", totalSales: 75 },
        ],
        // Opciones para el gráfico de ventas
        chartOptions: {
          chart: {
            type: "bar",
            toolbar: {
              show: false, // Desactiva la barra de herramientas
            },
          },
          xaxis: {
            categories: ["Hamburguesa", "Pizza", "Pasta", "Ensalada", "Soda"],
          },
        },
        // Datos del gráfico
        chartSeries: [
          {
            name: "Ventas",
            data: [150, 120, 100, 80, 75],
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .same-height {
    /* height: 100%; */ /* Asegura que las tarjetas tengan la misma altura */
  }
  .v-card {
    margin-bottom: 20px;
  }
  .v-row.align-items-center {
    display: flex;
    align-items: center; /* Centra el contenido verticalmente */
  }
  .v-card-title {
    width: 100%;
  }
  .v-card-subtitle {
    margin-top: 10px;
  }
  .v-data-table__wrapper tr {
    /* height: 50px !important; */ /* Ajusta el tamaño de la fila aquí */
  }
  </style>
  