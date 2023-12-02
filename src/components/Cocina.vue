<template>
    <v-container>
        <v-row>
            <v-col cols="6" sm="6" md="6" style="border:1px solid black;" v-for="datoCabeceraOrdenPedidoMesas in datosCabeceraOrdenPedidoMesas">
                <div>
                    <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Mesa: {{ datoCabeceraOrdenPedidoMesas.mesa_descripcion }}</p>
                    <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Fecha: {{ datoCabeceraOrdenPedidoMesas.created_at }}</p>
                    <!-- <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Tiempo transcurrido: {{ intervaloTiempoMinutos }} : {{ intervaloTiempoSegundos }}</p> -->
                </div>

                <div>
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left"
                                        :style="{ 'font-weight': '900', 'padding': '16px' }">
                                        Categoría
                                    </th>
                                    <th class="text-left"
                                        :style="{ 'font-weight': '900', 'padding': '16px' }">
                                        Plato
                                    </th>
                                    <th class="text-left"
                                        :style="{ 'font-weight': '900', 'padding': '16px' }">
                                        Cantidad
                                    </th>
                                    <th class="text-left"
                                        :style="{ 'font-weight': '900', 'padding': '16px' }">
                                        Observación
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in datoCabeceraOrdenPedidoMesas.detalleOrdenPedido"
                                    :key="item.IDDetalleOrdenPedido">
                                    <td>{{ item.nombre_categoria }}</td>
                                    <td>{{ item.nombre_productoLimpieza }}</td>
                                    <td>{{ item.dop_cantidad }}</td>
                                    <td>{{ item.observacion }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>

                <v-spacer></v-spacer>

                <div>
                    <v-btn class="ml-2" color="success" style="width: 100%;margin-top: 10px;margin-left: 0px !important;"
                        @click="despacharPedidoCocina(datoCabeceraOrdenPedidoMesas.id_cabedera_ordenes_pedido,datoCabeceraOrdenPedidoMesas.created_at)"
                        :disabled="manipularDisabledEnviarCocinaDespacho">
                        Despachar
                    </v-btn>
                </div>
            </v-col>
            <h1 v-if="datosCabeceraOrdenPedidoMesas == ''">No existen pedidos para cocina!</h1>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Cocina',
    data: () => ({
        datosCabeceraOrdenPedidoMesas: null,
        loading: false,
        manipularDisabledEnviarCocinaDespacho: false,
        intervaloTiempoMinutos: "",
        intervaloTiempoSegundos: ""
    }),
    async mounted() {
        this.loading = true;
        this.getDatosCabeceraOrdenPedidoMesas();
        this.calcularTiempoTranscurrido();
    },
    methods: {
        getDatosCabeceraOrdenPedidoMesas() {
            this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/getDatosCabeceraOrdenPedidoMesas',
                method: 'GET',
                async: false
            })
                .then(response => {
                    this.datosCabeceraOrdenPedidoMesas = response.data.data[0];
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        despacharPedidoCocina(identificadoresCabeceraOrdenesPedido,identificadorTiempoTomaPedido) {
            this.$swal({
                title: 'Quieres despachar el pedido?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Despachar',
                denyButtonText: `No despachar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios({
                        url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/actualizarDatosDespachoCocina',
                        method: 'GET',
                        async: false,
                        params: {
                            "id_cabecera_ordenes_pedido": identificadoresCabeceraOrdenesPedido,
                            "hora_inicial_pedido": identificadorTiempoTomaPedido
                        }
                    })
                    .then(response => {
                        if (response.status == 200) {
                            this.$swal('Pedido despachado correctamente', '', 'success');
                            this.getDatosCabeceraOrdenPedidoMesas();
                            this.manipularDisabledEnviarCocinaDespacho = false;
                        }
                    })
                    .catch(function (error) {
                        alert("Error en el sistema, comunicate con soporte técnico");
                    })
                    .finally(() => (this.loading = false));
                } else if (result.isDenied) {
                    this.$swal('No se pudo despachar el pedido', '', 'info');
                    this.manipularDisabledEnviarCocinaDespacho = false;
                } else {
                    this.manipularDisabledEnviarCocinaDespacho = false;
                }
            })
        },
        calcularTiempoTranscurrido() {
            var date = new Date();
            var padLeft = n => "00".substring(0, "00".length - n.length) + n;
            var interval = setInterval(() => {
                var minutes = padLeft(date.getMinutes() + "");
                var seconds = padLeft(date.getSeconds() + "");

                this.intervaloTiempoMinutos = minutes;
                this.intervaloTiempoSegundos = seconds;
                
                date = new Date(date.getTime() + 1000);
                // Si llega a 2:45, eliminar el intervalo
                /*if( minutes == '02' && seconds == '45' ) {
                    clearInterval(interval); 
                }*/
            }, 1000);
        }
    },
    updated: function () {
        setTimeout(function() {
            this.getDatosCabeceraOrdenPedidoMesas();
        }.bind(this), 30000)
    }
}
</script>