<template>
    <v-tabs color="deep-purple accent-4" right>
        <v-tab>Mesas</v-tab>
        <v-tab>Delivery</v-tab>
        <v-tab>Para llevar</v-tab>

        <v-tab-item v-for="n in 3" :key="n">
            <v-container fluid>
                <v-row justify="center">
                    <v-col v-for="listaMesa in listaMesas" :key="listaMesa.id" cols="6" sm="4" md="4">
                        <v-dialog v-model="listaMesa.mesa_modelo" persistent max-width="600px">
                            <template v-slot:activator="{ on, attrs }">
                                <div class="div-dialog-modal" v-if="listaMesa.IDStatus === 1"
                                    :style="{ 'background-color': '#337DFF' }" v-bind="attrs" v-on="on">
                                    <p>{{ listaMesa.mesa_descripcion }}</p>
                                </div>
                                <div class="div-dialog-modal" v-else :style="{ 'background-color': '#FF3F33' }"
                                    v-bind="attrs" v-on="on">
                                    <p>{{ listaMesa.mesa_descripcion }}</p>
                                </div>
                            </template>
                            <v-card v-if="listaMesa.IDStatus === 1">
                                <v-card-title
                                    :style="{ 'background-color': '#337DFF', 'justify-content': 'space-between' }">
                                    <span class="text-h5">{{ listaMesa.mesa_descripcion }}</span>
                                    <v-btn icon dark color="blue darken-1" text @click="listaMesa.mesa_modelo = false"
                                        style="background: black;">
                                        <v-icon smal>
                                            close
                                        </v-icon>
                                    </v-btn>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                <v-label>Categoría<span class="text-danger"> * </span></v-label>
                                                <v-select :items="optionsCategorias" v-model="selectedCategory"
                                                    @change="filterMe"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                <v-label>Producto(s)<span class="text-danger"> * </span></v-label>
                                                <v-select :items="listaProductos" item-text="nombre_productoLimpieza"
                                                    v-model="selectProduct" item-value="id_productoLimpieza"
                                                    @change="changeProductoAdd" required>
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                <v-text-field type="number" min="0" :value="1" :disabled="validateLoad"
                                                    v-model="cantidadPedido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6"
                                                v-for="productById in productoById">
                                                <v-text-field :disabled="true"
                                                    :value="productById.precio_unitario"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <!-- <v-row> -->
                                        <!--                                             <v-data-table :single-select="singleSelect" v-model="selected"
                                                item-key="descripcion" show-select :headers="headers"
                                                :items="listaProductosSeleccionados" :items-per-page="5"
                                                class="elevation-1"> -->
                                        <v-data-table search :headers="headers" :items="listaProductosSeleccionados"
                                            class="elevation-1">
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-toolbar-title>Detalle del pedido</v-toolbar-title>
                                                    <v-divider class="mx-4" inset vertical></v-divider>
                                                    <v-spacer></v-spacer>
                                                    <v-dialog v-model="dialog" max-width="500px">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn color="primary" @click="initialize">
                                                                Limpiar
                                                            </v-btn>
                                                            <v-btn class="ma-2" color="warning"
                                                                @click="almacenarListaPedido" :disabled="isButtonValid">
                                                                Añadir
                                                            </v-btn>
                                                        </template>
                                                        <v-card>
                                                            <v-card-title>
                                                                <span class="text-h5">Editar producto del pedido</span>
                                                            </v-card-title>

                                                            <v-card-text>
                                                                <v-container>
                                                                    <v-row>
                                                                        <v-col cols="12" sm="6" md="12">
                                                                            <v-text-field v-model="editedItem.descripcion"
                                                                                label="Descripción"
                                                                                :disabled="true"></v-text-field>
                                                                        </v-col>
                                                                        <v-col cols="12" sm="6" md="4">
                                                                            <v-text-field v-model="editedItem.cantidad"
                                                                                label="Cantidad"></v-text-field>
                                                                        </v-col>
                                                                        <v-col cols="12" sm="6" md="4">
                                                                            <v-text-field v-model="editedItem.precio"
                                                                                label="Precio"
                                                                                :disabled="true"></v-text-field>
                                                                        </v-col>
                                                                        <v-col cols="12" sm="6" md="4">
                                                                            <v-text-field v-model="editedItem.total"
                                                                                label="Total"
                                                                                :disabled="true"></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-container>
                                                            </v-card-text>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-btn color="blue darken-1" text @click="close">
                                                                    Cancelar
                                                                </v-btn>
                                                                <v-btn color="blue darken-1" text @click="save">
                                                                    Actualizar
                                                                </v-btn>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-dialog>
                                                    <v-dialog v-model="dialogDelete" max-width="500px">
                                                        <v-card>
                                                            <v-card-title class="text-h5">¿Deseas
                                                                eliminar este producto?</v-card-title>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-btn color="blue darken-1" text
                                                                    @click="closeDelete">Cancelar</v-btn>
                                                                <v-btn color="blue darken-1" text
                                                                    @click="deleteItemConfirm">Eliminar</v-btn>
                                                                <v-spacer></v-spacer>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-dialog>
                                                </v-toolbar>
                                            </template>
                                            <template v-slot:item.actions="{ item }">
                                                <v-icon small color="white" @click="editItem(item)"
                                                    :style="{ 'padding': '6px', 'background': '#FF9F33' }">
                                                    edit
                                                </v-icon>
                                                <v-icon small color="white" @click="deleteItem(item)"
                                                    :style="{ 'padding': '6px', 'background': '#FF3333' }">
                                                    delete
                                                </v-icon>
                                            </template>
                                        </v-data-table>
                                        <!-- </v-row> -->
                                        <v-row style="padding: 10px 0px 10px 0px;font-weight: 900;margin-top: 5px;">
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                <v-text>El monto total del pedido es: {{ totalPedido }}</v-text>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6" :style="{ 'text-align': 'right' }">
                                                <v-btn color="success" @click="valorMesaSeleccionada(listaMesa.IDMesa)"
                                                    :style="{ 'width': '100%' }">
                                                    Enviar a cocina
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-container>

                                    <small style="color: red;margin-left: 12px;">* Los campos son obligatorios</small>
                                </v-card-text>
                                <!--                                 <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="listaMesa.mesa_modelo = false">
                                        Close
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="dialog = false">
                                        Save
                                    </v-btn>
                                </v-card-actions> -->
                            </v-card>
                            <v-card v-else>
                                <v-card-title
                                    :style="{ 'background-color': '#337DFF', 'justify-content': 'space-between' }">
                                    <span class="text-h5">{{ listaMesa.mesa_descripcion }}</span>
                                    <v-btn icon dark color="blue darken-1" text
                                        @click="listaMesa.mesa_modelo = false, datosCabeceraOrdenPedido = null"
                                        style="background: black;">
                                        <v-icon smal>
                                            close
                                        </v-icon>
                                    </v-btn>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                <v-btn color="info" :style="{ 'width': '100%' }"
                                                    @click="getDatosCabeceraOrdenPedido(listaMesa.IDMesa)">
                                                    Ver cuenta
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                <v-btn color="success" :style="{ 'width': '100%' }">
                                                    Cobrar
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row v-for="datoCabeceraOrdenPedido in datosCabeceraOrdenPedido">
                                            <v-col cols="12">
                                                <h2
                                                    :style="{ 'text-align': 'center', 'font-weight': '900', 'text-decoration': 'underline' }">
                                                    La tete restobar</h2>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Transacción:
                                                </p>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <p :style="{ 'margin-bottom': '0px' }">{{
                                                    datoCabeceraOrdenPedido.odp_correlativo }}</p>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Mesa:</p>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <p :style="{ 'margin-bottom': '0px' }">{{
                                                    datoCabeceraOrdenPedido.mesa_descripcion }}</p>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Fecha:</p>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <p :style="{ 'margin-bottom': '0px' }">{{ datoCabeceraOrdenPedido.created_at
                                                }}</p>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-simple-table>
                                                    <template v-slot:default>
                                                        <thead>
                                                            <tr>
                                                                <th class="text-left"
                                                                    :style="{ 'font-weight': '900', 'padding': '16px 0px' }">
                                                                    Cantidad
                                                                </th>
                                                                <th class="text-left"
                                                                    :style="{ 'font-weight': '900', 'padding': '16px 0px' }">
                                                                    Descripción
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="item in datoCabeceraOrdenPedido.detalleOrdenPedido"
                                                                :key="item.IDDetalleOrdenPedido">
                                                                <td>{{ item.dop_cantidad }}</td>
                                                                <td>{{ item.nombre_productoLimpieza }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6"
                                                :style="{ 'background': 'red', 'color': 'white' }">
                                                <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Total:</p>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6"
                                                :style="{ 'background': 'black', 'color': 'white' }">
                                                <p :style="{ 'margin-bottom': '0px' }">S/. {{
                                                    datoCabeceraOrdenPedido.odp_monto_total
                                                }}</p>
                                            </v-col>



                                            <v-form @submit.prevent :style="{'width':'100%'}">
                                            <v-col cols="12">
                                                <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Enviar por
                                                    whatsapp:</p>
                                                <v-text-field :style="{'margin-top':'0px','padding-top':'0px'}"
                                                placeholder="Escribe el número" :maxlength="9"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-btn type="submit" block class="mt-2" color="success"
                                                :style="{ 'width': '100%', 'margin-top':'0px !important'}">
                                                    Enviar cuenta
                                                </v-btn>
                                            </v-col>
                                            </v-form>


                                        </v-row>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </v-col>
                </v-row>
            </v-container>
        </v-tab-item>
    </v-tabs>
    <!-- </v-card> -->
</template>

<style>
.div-dialog-modal {
    width: 100%;
    padding: 30px 0px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    cursor: pointer;
}

.div-dialog-modal p {
    color: black;
    margin-bottom: 0px;
}

.v-text-field__details {
    display: none;
}
</style>

<script>
export default {
    name: 'Mesas',
    data: () => ({
        datosCabeceraOrdenPedido: null,
        idMesaSelected: "",
        dialog: false,
        dialogDelete: false,
        singleSelect: false,
        selected: [],
        isButtonValid: true,
        validateLoad: true,
        loading: false,
        listaMesas: null,
        listaCategorias: null,
        listaProductos: null,
        productoById: null,
        dialog: false,
        selectedCategory: 1,
        selectProduct: "",
        cantidadPedido: 1,
        totalPedido: 0,
        listaMesa: { IDMesa: '' },
        headers: [
            { text: 'Descripción', align: 'start', value: 'descripcion' },
            { text: 'Cantidad', value: 'cantidad' },
            { text: 'Precio', value: 'precio' },
            { text: 'Total', value: 'total' },
            { text: 'Actions', value: 'actions', sortable: false }
        ],
        listaProductosSeleccionados: [],
        editedIndex: -1,
        editedItem: {
            descripcion: '',
            cantidad: 0,
            precio: 0,
            total: 0
        },
        defaultItem: {
            descripcion: '',
            cantidad: 0,
            precio: 0,
            total: 0
        },
    }),
    async mounted() {
        this.loading = true;
        await this.getListCategorias();
        await this.getListMesas();
        await this.getListProductos(this.selectedCategory);
    },
    computed: {
        optionsCategorias() {
            return this.listaCategorias.map((item) => {
                return {
                    text: item.nombre_categoria,
                    value: item.id_categoria
                };
            }).sort((a, b) => b.count - a.count);
        }
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        }
    },
    created() {
        this.initialize()
    },
    methods: {
        async getListMesas() {
            await this.axios({
                url: 'http://192.168.18.5:8000/api/auth/listarMesas',
                method: 'GET',
                async: false
            })
                .then(response => {
                    this.listaMesas = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async getListCategorias() {
            await this.axios({
                url: 'http://192.168.18.5:8000/api/auth/listarCategorias',
                method: 'GET',
                async: false
            })
                .then(response => {
                    this.listaCategorias = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async getListProductos(idCategoriaSelected) {
            await this.axios({
                url: 'http://192.168.18.5:8000/api/auth/listarProductoPorCategoria',
                method: 'GET',
                async: false,
                params: { idCategoriaSelected }
            })
                .then(response => {
                    this.listaProductos = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async cambiarStatusMesa(jsonStatusMesa) {
            await this.axios({
                url: 'http://192.168.18.5:8000/api/auth/cambiarStatusMesa',
                method: 'GET',
                async: false,
                params: {
                    "IDStatus": jsonStatusMesa.IDStatus,
                    "IDMesa": jsonStatusMesa.IDMesa
                }
            })
                .then(response => {
                    console.log("Mesa actualizada correctamente")
                    this.getListMesas();
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async getProductoById(idProductoSelected) {
            await this.axios({
                url: 'http://192.168.18.5:8000/api/auth/getProductoById',
                method: 'GET',
                async: false,
                params: { idProductoSelected }
            })
                .then(response => {
                    this.productoById = response.data.data;
                    this.validateLoad = false;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async getDatosCabeceraOrdenPedido(idMesaSeleccionadaActual) {
            await this.axios({
                url: 'http://192.168.18.5:8000/api/auth/getDatosCabeceraOrdenPedido',
                method: 'GET',
                async: false,
                params: { idMesaSeleccionadaActual }
            })
                .then(response => {
                    this.datosCabeceraOrdenPedido = response.data.data;
                    console.log(this.datosCabeceraOrdenPedido);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        createCabeceraOrdenPedido(jsonCreateOrdenPedido) {
            this.axios({
                url: 'http://192.168.18.5:8000/api/auth/createOrdenPedido',
                method: 'GET',
                async: false,
                params: {
                    "odp_monto_total": jsonCreateOrdenPedido.odp_monto_total,
                    "IDMesa": jsonCreateOrdenPedido.IDMesa,
                    "IDStatus": 3,
                    "detalleOrdenPedido": jsonCreateOrdenPedido.detalleOrdenPedido
                }
            })
                .then(response => {
                    if (response.status == 200) {
                        this.$swal({
                            title: 'Quieres guardar los cambios?',
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: 'Guardar',
                            denyButtonText: `No guardar`,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.$swal('Orden de pedido creada correctamente', '', 'success')
                                this.listaMesa.mesa_modelo = false;
                                this.initialize();

                                let jsonStatusMesa = {
                                    "IDStatus": 2,
                                    "IDMesa": jsonCreateOrdenPedido.IDMesa
                                }

                                this.cambiarStatusMesa(jsonStatusMesa);
                            } else if (result.isDenied) {
                                this.$swal('Orden de pedido no se pudo crear', '', 'info')
                            }
                        })
                    }
                })
                .catch(function (error) {
                    alert("Error en el sistema, comunicate con soporte técnico");
                })
                .finally(() => (this.loading = false));
        },
        filterMe() {
            this.listaCategorias.filter(function (el) {
                return el.id_categoria === this.selectedCategory;
            }, this);
            this.getListProductos(this.selectedCategory);
        },
        changeProductoAdd() {
            this.getProductoById(this.selectProduct);
            this.isButtonValid = false;
        },
        almacenarListaPedido() {
            let sumaMonto = this.cantidadPedido * this.productoById[0].precio_unitario;

            let agregarListaObjeto = {
                id_producto: this.productoById[0].id_productoLimpieza,
                descripcion: this.productoById[0].nombre_productoLimpieza,
                cantidad: this.cantidadPedido,
                precio: this.productoById[0].precio_unitario,
                total: sumaMonto
            }

            this.listaProductosSeleccionados.push(agregarListaObjeto)
            this.totalDetalle();
        },
        initialize() {
            this.listaProductosSeleccionados = [];
            this.totalDetalle();
        },
        totalDetalle() {
            this.totalPedido = 0;

            this.listaProductosSeleccionados.forEach((value) => {
                this.totalPedido += value.total;
            });

            this.productoById = null;
            this.cantidadPedido = 1;
            this.validateLoad = true;
            this.isButtonValid = true;
        },
        editItem(item) {
            this.editedIndex = this.listaProductosSeleccionados.indexOf(item)
            this.editedItem = Object.assign({}, item)

            console.log(this.editedItem.cantidad);

            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.listaProductosSeleccionados.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.listaProductosSeleccionados.splice(this.editedIndex, 1)
            this.closeDelete()
            this.totalDetalle();
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                this.editedItem.total = this.editedItem.cantidad * this.editedItem.precio;
                Object.assign(this.listaProductosSeleccionados[this.editedIndex], this.editedItem)
                this.totalDetalle();
            }
            this.close()
        },
        crearOrdenPedido() {
            if (this.listaProductosSeleccionados.length == 0) {
                this.$swal({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se puede agregar una lista vacia!'
                })
            } else {
                let arregloDetalleOrdenPedido = [];

                this.listaProductosSeleccionados.forEach((value) => {
                    arregloDetalleOrdenPedido.push(value)
                });

                let jsonFormater = {
                    "odp_monto_total": this.totalPedido,
                    "IDMesa": this.idMesaSelected,
                    "IDStatus": 3,
                    "detalleOrdenPedido": arregloDetalleOrdenPedido
                }

                this.createCabeceraOrdenPedido(jsonFormater);
            }
        },
        valorMesaSeleccionada(mesaSeleccionada) {
            this.idMesaSelected = mesaSeleccionada;
            this.crearOrdenPedido();
        }
    }
}
</script>