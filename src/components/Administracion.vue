<template>
    <v-container>
        <v-row v-if="periodoAbiertoValidacion == false">
            <v-btn type="button" color="primary" :style="{ 'width': '100%' }"
                :disabled="manipularDisabledCalcularCuadreCaja" @click="iniciarPeriodoVenta">
                Iniciar periodo de venta
            </v-btn>
        </v-row>

        <v-row v-if="periodoAbiertoValidacion == true">
            <v-col cols="12">
                <h3 :style="{ 'font-weight': '900' }">Montos generales antes de cerrar caja para un mejor control.</h3>
            </v-col>
            <v-col v-for="listaTotalRegistroCierreCaja in listaTotalRegistrosCierreCaja.cfac_cantidades_total"
                :key="listaTotalRegistroCierreCaja.IDFormaPago" cols="6" xs="12"
                :style="{ 'border': '1px solid black', 'padding': '12px', 'box-sizing': 'border-box' }">
                <p :style="{ 'font-weight': '900', 'text-decoration': 'underline' }">{{
                    listaTotalRegistroCierreCaja.fp_descripcion }}</p>
                <v-text-field type="text" :disabled="true"
                    :value="'Cantidad:' + listaTotalRegistroCierreCaja.cfac_cantidad_total"
                    :style="{ 'width': '50%', 'float': 'left', 'padding-right': '10px' }">
                </v-text-field>
                <v-text-field type="text" :disabled="true"
                    :value="'Suma:' + listaTotalRegistroCierreCaja.cfac_monto_total_suma"
                    :style="{ 'width': '50%', 'float': 'right', 'padding-left': '10px' }">
                </v-text-field>
            </v-col>
            <v-col></v-col>
            <v-col cols="12">
                <h3 :style="{ 'font-weight': '900' }">Suma total de ingresos antes del último cierre: <span
                        :style="{ 'color': 'red' }">{{ listaTotalRegistrosCierreCaja.cfac_monto_total_general }}
                        soles</span>
                </h3>
            </v-col>
        </v-row>
        <form v-if="periodoAbiertoValidacion == true" @submit.prevent="eventoCalcularCuadreCaja()">
            <v-row>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <h3 :style="{ 'font-weight': '900' }">Monto del último cuadre de caja:</h3>
                    <v-text-field type="number" step="any" :disabled="true" v-model="listaTotalRegistrosCierreCaja.monto_total_ultimo_cuadre" required>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <h3 :style="{ 'font-weight': '900' }">Suma total de gastos:</h3>
                    <v-text-field type="number" step="any" :disabled="true" v-model="listaTotalRegistrosCierreCaja.ga_monto_total_general" required>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <v-btn type="submit" color="success" :style="{ 'width': '100%' }"
                        :disabled="manipularDisabledCalcularCuadreCaja">
                        Calcular cuadre de caja
                    </v-btn>
                </v-col>
            </v-row>
        </form>
    </v-container>
</template>

<script>
export default {
    name: 'Administracion',
    data: () => ({
        periodoAbiertoValidacion: false,
        manipularDisabledCalcularCuadreCaja: false,
        listaTotalRegistrosCierreCaja: null,
        montoTotalUltimoCuadre: "",
    }),
    async mounted() {
        await this.verificarPeriodoActivo();
        await this.totalRegistrosCierreCaja();
    },
    methods: {
        async totalRegistrosCierreCaja() {
            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/totalRegistrosCierreCaja',
                method: 'GET',
                async: false
            })
                .then(response => {
                    this.listaTotalRegistrosCierreCaja = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async actualizarTotalRegistrosCierreCaja(calculoMontoCaja) {
            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/actualizarTotalRegistrosCierreCaja',
                method: 'GET',
                async: false,
                params: {
                    "calculoMontoCaja": calculoMontoCaja
                }
            })
                .then(response => {
                    this.totalRegistrosCierreCaja();
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async abrirPeriodoVenta() {
            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/abrirPeriodoVenta',
                method: 'GET',
                async: false
            })
                .then(response => {
                    if (response.status == 200) {
                        this.periodoAbiertoValidacion = true;
                        this.$swal('Periodo generado correctamente', '', 'success')
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async verificarPeriodoActivo() {
            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/verificarPeriodoActivo',
                method: 'GET',
                async: false
            })
                .then(response => {
                    if (response.data.data.length > 0) {
                        this.periodoAbiertoValidacion = true;
                    } else {
                        this.periodoAbiertoValidacion = false;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        eventoCalcularCuadreCaja() {
            this.manipularDisabledCalcularCuadreCaja = true;
            let calculoMontoCaja = (parseFloat(this.listaTotalRegistrosCierreCaja.cfac_monto_total_general) + parseFloat(this.listaTotalRegistrosCierreCaja.monto_total_ultimo_cuadre)) - parseFloat(this.listaTotalRegistrosCierreCaja.ga_monto_total_general);

            this.$swal({
                title: 'El monto es: ' + calculoMontoCaja + ', Quieres guardar los cambios?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                denyButtonText: `No guardar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$swal('Datos actualizados correctamente', '', 'success')
                    this.actualizarTotalRegistrosCierreCaja(calculoMontoCaja);
                    this.montoTotalUltimoCuadre = "";
                    this.manipularDisabledCalcularCuadreCaja = false;
                    this.periodoAbiertoValidacion = false;
                } else if (result.isDenied) {
                    this.$swal('Datos no actualizados, verificar errores', '', 'info');
                    this.manipularDisabledCalcularCuadreCaja = false;
                    this.periodoAbiertoValidacion = true;
                } else {
                    this.manipularDisabledCalcularCuadreCaja = false;
                    this.periodoAbiertoValidacion = true;
                }
            })
        },
        iniciarPeriodoVenta() {
            this.$swal({
                title: 'Se va a iniciar un nuevo periodo, Quieres guardar los cambios?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Iniciar',
                denyButtonText: `No iniciar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.abrirPeriodoVenta();
                } else if (result.isDenied) {
                    this.$swal('No se creó un periodo de venta', '', 'info');
                    this.periodoAbiertoValidacion = false;
                } else {
                    this.periodoAbiertoValidacion = false;
                }
            })
        }
    }
}
</script>