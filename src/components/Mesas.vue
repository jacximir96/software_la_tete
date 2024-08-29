<template>
    <div style="padding: 0px;">
        <v-overlay :value="isLoading" :style="{ zIndex: 9999, position: 'fixed', top: '0', left: '0', width: '100%', height: '100vh' }">
            <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                <v-progress-circular
                    color="primary"
                    :size="78"
                    :width="12"
                    indeterminate
                ></v-progress-circular>
            </div>
        </v-overlay>

        <v-tabs scrollable v-model="tab" background-color="white" dark icons-and-text v-if="periodoAbiertoValidacion == true">
            <v-tab href="#tab-1" class="custom-tab custom-tab-size-no-selected" :style="{ 'margin-left': '12px' }">Piso 01</v-tab>
            <v-tab href="#tab-2" class="custom-tab custom-tab-size-no-selected">Piso 02</v-tab>
            <v-tab href="#tab-3" class="custom-tab custom-tab-size-no-selected">Piso 03</v-tab>

            <v-tabs-items v-model="tab">
                <v-tab-item v-for="i in 2" :key="i" :value="'tab-' + i">
                    <v-container fluid v-if="i == 1">
                        <v-row justify="center">
                            <v-col v-for="listaMesa in listaMesas" :key="listaMesa.id" cols="6" sm="6" md="4" lg="3" xl="2" class="custom-col">
                                <v-dialog v-model="listaMesa.mesa_modelo" persistent max-width="800px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <div class="div-dialog-modal" v-if="listaMesa.IDStatus === 1"
                                            v-bind="attrs" v-on="on">
                                            <p class="texto-mesa">{{ listaMesa.mesa_descripcion }}</p>
                                            <v-img
                                                src="@/assets/img/mesa.png"
                                                alt="Imagen de mesa"
                                                contain
                                                max-width="150"
                                                max-height="100"
                                                style="margin-top: 20px;margin-bottom: 20px;"
                                            ></v-img>
                                            <p><span style="margin-right: 8px;">👆</span>Presione aquí</p>
                                        </div>
                                        <div class="div-dialog-modal" v-else :style="{ 'background-color': '#D9534F' }"
                                            v-bind="attrs" v-on="on">
                                            <p class="texto-mesa texto-mesa-ocupado">{{ listaMesa.mesa_descripcion }}</p>
                                            <v-img
                                                src="@/assets/img/mesa.png"
                                                alt="Imagen de mesa"
                                                contain
                                                max-width="150"
                                                max-height="100"
                                                style="margin-top: 20px;margin-bottom: 20px;"
                                            ></v-img>
                                            <p class="texto-mesa-ocupado"><span style="margin-right: 8px;">🔴</span>Ocupado</p>
                                        </div>
                                    </template>
                                    <v-card v-if="listaMesa.IDStatus === 1">
                                        <v-card-title
                                            :style="{ 'background-color': '#337DFF', 'justify-content': 'space-between' }">
                                            <span class="text-h5">{{ listaMesa.mesa_descripcion }}</span>
                                            <v-btn icon dark color="blue darken-1" text
                                                @click="listaMesa.mesa_modelo = false, inicializarBotones()"
                                                style="background: black;">
                                                <v-icon smal>
                                                    v-icon
                                                </v-icon>
                                            </v-btn>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                        <v-label>Categoría<span class="text-danger"> * </span></v-label>
                                                        <v-autocomplete
                                                            :items="optionsCategorias"
                                                            v-model="selectedCategory"
                                                            @change="filterMe"
                                                            label="Selecciona una categoría"
                                                            clearable
                                                            solo
                                                            :search-input.sync="searchCategory"
                                                            item-text="text"
                                                            item-value="value"
                                                            placeholder="Escribe para buscar..."
                                                            style="margin-top: 8px;"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                        <v-label>Producto(s)<span class="text-danger"> * </span></v-label>
                                                        <v-autocomplete
                                                            :items="listaProductos"
                                                            v-model="selectProduct"
                                                            @change="changeProductoAdd"
                                                            label="Selecciona un producto"
                                                            clearable
                                                            solo
                                                            :search-input.sync="searchProduct"
                                                            item-text="nombre_productoLimpieza"
                                                            item-value="id_productoLimpieza"
                                                            placeholder="Escribe para buscar..."
                                                            style="margin-top: 8px;"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                        <v-label>Cantidad<span class="text-danger"> * </span></v-label>
                                                        <v-text-field
                                                            type="number"
                                                            min="1"
                                                            v-model="cantidadPedido"
                                                            label="Cantidad"
                                                            outlined
                                                            solo
                                                            class="custom-text-field"
                                                            placeholder="Ingresa la cantidad"
                                                            style="width: 100%; margin-top: 8px;"
                                                        >
                                                        <template v-slot:append>
                                                            <v-icon @click="incrementarCantidad">add_circle</v-icon>
                                                        </template>
                                                        <template v-slot:prepend>
                                                            <v-icon @click="decrementarCantidad">remove_circle</v-icon>
                                                        </template>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6" lg="6" xl="6"
                                                        v-for="productById in productoById">
                                                        <v-label>Precio unitario<span class="text-danger"> * </span></v-label>
                                                            <v-text-field
                                                                v-if="selectProduct == '' ? productById.precio_unitario = '' : productById.precio_unitario"
                                                                :value="productById.precio_unitario"
                                                                type="number"
                                                                label="Precio unitario"
                                                                outlined
                                                                solo
                                                                class="custom-text-field"
                                                                style="width: 100%; margin-top: 8px;"
                                                                disabled="true"
                                                            ></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row v-if="eventoClickAgregarObservacion">
                                                    <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                        <v-text-field type="text" :disabled="validateLoad"
                                                        placeholder="Ingresar observación del producto" v-model="observacionPedido" required></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-data-table search :headers="headers" :items="listaProductosSeleccionados"
                                                    class="elevation-1">
                                                    <template v-slot:top>
                                                        <v-toolbar flat>
                                                            <v-toolbar-title>Detalle del pedido</v-toolbar-title>
                                                            <v-divider class="mx-4" inset vertical></v-divider>
                                                            <v-spacer></v-spacer>
                                                            <v-dialog v-model="dialog" max-width="500px">
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-btn class="ml-2" color="success" fab small dark
                                                                        @click="almacenarListaPedido" :disabled="isButtonValid">
                                                                        <v-icon>add</v-icon>
                                                                    </v-btn>
                                                                    <v-btn class="ml-2" color="error" fab small dark @click="initialize">
                                                                        <v-icon>cleaning_services</v-icon>
                                                                    </v-btn>
                                                                    <v-btn color="info" fab small dark @click="validacionAgregarCuenta">
                                                                        <v-icon>bookmark_add</v-icon>
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
                                                                                    <v-text-field
                                                                                        v-model="editedItem.descripcion"
                                                                                        label="Descripción"
                                                                                        :disabled="true"></v-text-field>
                                                                                </v-col>
                                                                                <v-col cols="12" sm="6" md="4">
                                                                                    <v-text-field type="number" min="0"
                                                                                        v-model="editedItem.cantidad"
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
                                                                                <v-col cols="12" sm="6" md="4">
                                                                                    <v-text-field v-model="editedItem.observacion"
                                                                                        label="Observación"></v-text-field>
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
                                                        <v-icon small dark color="white" @click="editItem(item)"
                                                            :style="{ 'padding': '6px', 'background': '#FF9F33' }">
                                                            edit
                                                        </v-icon>
                                                        <v-icon small dark color="white" @click="deleteItem(item)"
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
                                                    <v-col cols="12" sm="6" md="6" lg="6" xl="6"
                                                        :style="{ 'text-align': 'right' }">
                                                        <v-btn color="primary" @click="valorMesaSeleccionada(listaMesa.IDMesa)"
                                                            :style="{ 'width': '100%' }"
                                                            :disabled="manipularDisabledEnviarCocina">
                                                            Enviar a cocina
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-container>

                                            <small style="color: red;margin-left: 12px;">* Los campos son obligatorios</small>
                                        </v-card-text>
                                    </v-card>
                                    <v-card v-else>
                                        <v-card-title
                                            :style="{ 'background-color': '#337DFF', 'justify-content': 'space-between' }">
                                            <span class="text-h5">{{ listaMesa.mesa_descripcion }}</span>
                                            <v-btn icon dark color="blue darken-1" text
                                                @click="listaMesa.mesa_modelo = false, datosCabeceraOrdenPedido = null, inicializarBotones()"
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
                                                        <v-btn color="success" :style="{ 'width': '100%' }"
                                                            @click="eventoCobrarMonto()">
                                                            Cobrar
                                                        </v-btn>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                        <v-btn color="secondary" :style="{ 'width': '100%' }"
                                                            @click="eventoCobrarMontoCuentaSeparada()">
                                                            Cuentas separadas
                                                        </v-btn>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                        <v-btn color="error" :style="{ 'width': '100%' }"
                                                            @click="eventoAumentarPedido()">
                                                            Añadir nuevo pedido
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>

                                                <v-divider :style="{ 'margin-top': '30px', 'margin-bottom': '30px' }"
                                                    v-if="eventoClickVerCuenta == true || eventoClickCobrar == true || eventoClickTomarPedido == true || eventoClickCobrarCuentaSeparada == true"></v-divider>

                                                <v-row v-for="datoCabeceraOrdenPedido in datosCabeceraOrdenPedido"
                                                    v-if="eventoClickVerCuenta == true">
                                                    <v-col cols="12">
                                                        <h2
                                                            :style="{ 'text-align': 'center', 'font-weight': '900', 'text-decoration': 'underline' }">
                                                            La tete restobar</h2>
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
                                                        <p :style="{ 'margin-bottom': '0px' }">{{
                                                            datoCabeceraOrdenPedido.created_at
                                                        }}</p>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-simple-table>
                                                            <template v-slot:default>
                                                                <thead>
                                                                    <tr>
                                                                        <th class="text-left"
                                                                            :style="{ 'font-weight': '900', 'padding': '16px' }">
                                                                            Cantidad
                                                                        </th>
                                                                        <th class="text-left"
                                                                            :style="{ 'font-weight': '900', 'padding': '16px' }">
                                                                            Categoría
                                                                        </th>
                                                                        <th class="text-left"
                                                                            :style="{ 'font-weight': '900', 'padding': '16px' }">
                                                                            Descripción
                                                                        </th>
                                                                        <th class="text-left"
                                                                            :style="{ 'font-weight': '900', 'padding': '16px' }">
                                                                            Precio Unit.
                                                                        </th>
                                                                        <th class="text-left"
                                                                            :style="{ 'font-weight': '900', 'padding': '16px' }">
                                                                            Precio Tot.
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="item in datoCabeceraOrdenPedido.detalleOrdenPedido"
                                                                        :key="item.IDDetalleOrdenPedido">
                                                                        <td>{{ item.dop_cantidad }}</td>
                                                                        <td>{{ item.nombre_categoria }}</td>
                                                                        <td>{{ item.nombre_productoLimpieza }}</td>
                                                                        <td>S/ {{ item.dop_precio }}</td>
                                                                        <td>S/ {{ item.dop_total }}</td>
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
                                                    <!-- <v-col cols="12">
                                                        <form @submit.prevent="enviarMensajeTextoCliente()" :style="{ 'width': '100%' }">
                                                            <v-col cols="12">
                                                                <p :style="{ 'margin-bottom': '0px', 'font-weight': '900' }">Enviar
                                                                    por
                                                                    whatsapp:</p>
                                                                <v-text-field :style="{ 'margin-top': '0px', 'padding-top': '0px' }"
                                                                    placeholder="Escribe el número" :maxlength="9" required></v-text-field>
                                                            </v-col>
                                                            <v-col cols="12">
                                                                <v-btn type="submit" block class="mt-2" color="success"
                                                                    :style="{ 'width': '100%', 'margin-top': '0px !important' }">
                                                                    Enviar cuenta
                                                                </v-btn>
                                                            </v-col>
                                                        </form>
                                                    </v-col> -->
                                                </v-row>
                                                <v-row v-if="eventoClickCobrarCuentaSeparada == true">
                                                </v-row>
                                                <v-row v-if="eventoClickCobrar == true">
                                                    <!-- <form @submit.prevent="cobrarPedidoMesaSeleccionada(listaMesa.IDMesa)"
                                                        :style="{ 'width': '100%' }">
                                                        <v-col cols="6">
                                                            <v-label>Forma de pago<span class="text-danger"> * </span></v-label>
                                                            <v-select :items="listaFormaPago" item-text="fp_descripcion"
                                                                v-model="selectFormaPago" item-value="IDFormaPago"
                                                                required></v-select>
                                                        </v-col>

                                                        <v-col cols="6">
                                                            <v-label>Forma de pago<span class="text-danger"> * </span></v-label>
                                                            <v-select :items="listaFormaPago" item-text="fp_descripcion"
                                                                v-model="selectFormaPago" item-value="IDFormaPago"
                                                                required></v-select>
                                                        </v-col>

                                                        <v-col cols="12" v-if="selectFormaPago == 1">
                                                            <v-label>Ingresa monto<span class="text-danger"> * </span></v-label>
                                                            <v-text-field type="number"
                                                                :style="{ 'margin-top': '0px', 'padding-top': '0px', 'margin-top': '16px' }"
                                                                placeholder="Escribe el monto" :maxlength="3" min="0"
                                                                :rules="ingresarMontoRules" v-model="montoEfectivo" required>
                                                            </v-text-field>
                                                        </v-col>

                                                        <v-col cols="12">
                                                            <v-btn type="submit" color="success" :style="{ 'width': '100%' }"
                                                                :disabled="manipularDisabledCobrarMonto">
                                                                Cobrar
                                                            </v-btn>
                                                        </v-col>
                                                    </form> -->

                                                    <form @submit.prevent="cobrarPedidoMesaSeleccionada(listaMesa.IDMesa)" :style="{ 'width': '100%' }">
                                                        <v-row>
                                                        <!-- Campo de Selección de Cliente con Búsqueda por DNI/RUC -->
                                                        <v-col cols="12">
                                                            <v-row align="center">
                                                                <v-col cols="12" sm="8" md="8" lg="8" xl="8">
                                                                    <v-label>Seleccionar Cliente<span class="text-danger"> * </span></v-label>
                                                                    <v-text-field
                                                                        v-model="searchCliente"
                                                                        type="text"
                                                                        outlined
                                                                        solo
                                                                        class="custom-text-field"
                                                                        style="width: 100%; margin-top: 8px;"
                                                                        placeholder="Buscar por DNI o RUC"
                                                                        @input="buscarCliente"
                                                                        label="DNI o RUC"
                                                                    ></v-text-field>

                                                                    <p v-if="errorMessage" style="color: red; margin-top: 8px;">
                                                                        {{ errorMessage }}
                                                                    </p>


                                                                </v-col>
                                                                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                                                                    <v-btn color="primary" @click="abrirModalRegistroCliente" :style="{ 'width': '100%' }">Registrar Cliente</v-btn>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row v-if="clienteEncontrado == true">
                                                                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                                    <v-text-field v-model="cliente.nombre" label="Nombre del Cliente" readonly></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                                    <v-text-field v-model="cliente.dni" label="DNI del Cliente" readonly></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                                    <v-text-field v-model="cliente.telefono" label="Teléfono del Cliente" readonly></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                                    <v-text-field v-model="cliente.email" label="Email del Cliente" readonly></v-text-field>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row>
                                                                <v-col cols="12">
                                                                    <v-btn @click="clearCliente">Limpiar Búsqueda</v-btn>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>

                                                        <!-- Campos para forma de pago y monto -->
                                                        <v-col cols="12">
                                                            <v-label>Forma de pago<span class="text-danger"> * </span></v-label>
                                                            <v-autocomplete
                                                                item-text="fp_descripcion"
                                                                item-value="IDFormaPago"
                                                                :items="listaFormaPago"
                                                                v-model="selectFormaPago"
                                                                @change="changeProductoAdd"
                                                                label="Selecciona forma de pago"
                                                                clearable
                                                                solo
                                                                :search-input.sync="searchProduct"
                                                                placeholder="Escribe para buscar..."
                                                                style="margin-top: 8px;"
                                                                required
                                                            ></v-autocomplete>
                                                        </v-col>

                                                        <v-col cols="12" v-if="selectFormaPago == 1">
                                                            <v-label>Ingresa monto<span class="text-danger"> * </span></v-label>
                                                            <v-text-field type="number" placeholder="Escribe el monto" :maxlength="3" min="0" :rules="ingresarMontoRules" v-model="montoEfectivo" required>
                                                            </v-text-field>
                                                        </v-col>

                                                        <v-col cols="12">
                                                            <v-btn type="submit" color="success" :style="{ 'width': '100%' }" :disabled="manipularDisabledCobrarMonto">
                                                            Cobrar
                                                            </v-btn>
                                                        </v-col>
                                                        </v-row>
                                                    </form>

                                                    <v-dialog v-model="modalRegistroCliente" max-width="500px">
                                                        <v-card>
                                                            <v-card-title class="headline">Registrar Cliente</v-card-title>
                                                            <v-card-text>
                                                                <v-text-field 
                                                                    v-model="nuevoCliente.nombre" 
                                                                    label="Nombre del Cliente" 
                                                                    required 
                                                                    :rules="[v => !!v || 'Nombre es requerido']"
                                                                ></v-text-field>
                                                                <v-text-field 
                                                                    v-model="nuevoCliente.dni" 
                                                                    label="DNI del Cliente" 
                                                                    required 
                                                                    :rules="[v => !!v || 'DNI es requerido']"
                                                                ></v-text-field>
                                                                <v-text-field 
                                                                    v-model="nuevoCliente.telefono" 
                                                                    label="Teléfono del Cliente" 
                                                                    required 
                                                                    :rules="[v => !!v || 'Teléfono es requerido']"
                                                                ></v-text-field>
                                                                <v-text-field 
                                                                    v-model="nuevoCliente.email" 
                                                                    label="Email del Cliente" 
                                                                    required 
                                                                    :rules="[v => !!v || 'Email es requerido']"
                                                                ></v-text-field>
                                                            </v-card-text>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-btn color="blue darken-1" text @click="cerrarModalRegistroCliente">Cancelar</v-btn>
                                                                <v-btn color="blue darken-1" text @click="registrarCliente">Guardar</v-btn>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-dialog>
                                                </v-row>
                                                <div v-if="eventoClickTomarPedido == true" :style="{ 'margin-top': '12px' }">
                                                    <v-row>
                                                        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                            <v-label>Categoría<span class="text-danger"> *
                                                                </span></v-label>
                                                            <v-select :items="optionsCategorias" v-model="selectedCategory"
                                                                @change="filterMe"></v-select>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                            <v-label>Producto(s)<span class="text-danger"> *
                                                                </span></v-label>
                                                            <v-select :items="listaProductos"
                                                                item-text="nombre_productoLimpieza" v-model="selectProduct"
                                                                item-value="id_productoLimpieza" @change="changeProductoAdd"
                                                                required>
                                                            </v-select>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                            <v-text-field type="number" min="1" :value="1"
                                                                :disabled="validateLoad"
                                                                v-model="cantidadPedido"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="6" lg="6" xl="6"
                                                            v-for="productById in productoById">
                                                            <v-text-field :disabled="true"
                                                                :value="productById.precio_unitario"></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-if="eventoClickAgregarObservacion">
                                                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                            <v-text-field type="text" :disabled="validateLoad"
                                                            placeholder="Ingresar observación del producto" v-model="observacionPedido"></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-data-table search :headers="headers" :items="listaProductosSeleccionados"
                                                        class="elevation-1">
                                                        <template v-slot:top>
                                                            <v-toolbar flat>
                                                                <v-toolbar-title>Detalle del pedido</v-toolbar-title>
                                                                <v-divider class="mx-4" inset vertical></v-divider>
                                                                <v-spacer></v-spacer>
                                                                <v-dialog v-model="dialog" max-width="500px">
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-btn class="ml-2" color="success" fab small dark
                                                                            @click="almacenarListaPedido"
                                                                            :disabled="isButtonValid">
                                                                            <v-icon>add</v-icon>
                                                                        </v-btn>
                                                                        <v-btn class="ml-2" color="error" fab small dark @click="initialize">
                                                                            <v-icon>cleaning_services</v-icon>
                                                                        </v-btn>
                                                                        <v-btn color="info" fab small dark @click="validacionAgregarCuenta">
                                                                            <v-icon>bookmark_add</v-icon>
                                                                        </v-btn>
                                                                    </template>

                                                                    <v-card>
                                                                        <v-card-title>
                                                                            <span class="text-h5">Editar producto del
                                                                                pedido</span>
                                                                        </v-card-title>

                                                                        <v-card-text>
                                                                            <v-container>
                                                                                <v-row>
                                                                                    <v-col cols="12" sm="6" md="12">
                                                                                        <v-text-field
                                                                                            v-model="editedItem.descripcion"
                                                                                            label="Descripción"
                                                                                            :disabled="true"></v-text-field>
                                                                                    </v-col>
                                                                                    <v-col cols="12" sm="6" md="4">
                                                                                        <v-text-field
                                                                                            v-model="editedItem.cantidad"
                                                                                            label="Cantidad"></v-text-field>
                                                                                    </v-col>
                                                                                    <v-col cols="12" sm="6" md="4">
                                                                                        <v-text-field
                                                                                            v-model="editedItem.precio"
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
                                                    <v-row style="padding: 10px 0px 10px 0px;font-weight: 900;margin-top: 5px;">
                                                        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                            <v-text>El monto total del pedido es: {{ totalPedido
                                                            }}</v-text>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="6" lg="6" xl="6"
                                                            :style="{ 'text-align': 'right' }">
                                                            <v-btn color="primary"
                                                                @click="valorMesaSeleccionada(listaMesa.IDMesa)"
                                                                :style="{ 'width': '100%' }"
                                                                :disabled="manipularDisabledEnviarCocina">
                                                                Enviar a cocina
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </v-container>
                                        </v-card-text>
                                    </v-card>
                                </v-dialog>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container v-else>
                        <v-row justify="center">
                            <v-col cols="12">
                                <p>Pedidos para llevar - en mantenimiento!!</p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>
    </div>
</template>

<style scoped>
.custom-text-field .v-input__prepend-inner,
.custom-text-field .v-input__append-inner {
    max-width: none;
    display: flex;
    align-items: center;
}
.custom-text-field .v-input__control {
    padding-left: 40px;
    padding-right: 40px;
}
.custom-text-field .v-icon--link {
    cursor: pointer;
    font-size: 24px;
}
.custom-text-field input {
    text-align: center;
    padding-left: 0;
    padding-right: 0;
}
.custom-text-field .v-input__control {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    box-sizing: border-box;
}
::v-deep .v-tabs-bar {
    height: 120px !important;
    flex-wrap: wrap;
}
::v-deep .v-tab {
    height: 60px !important;
    line-height: 60px !important;
    padding: 0 16px !important;
}
::v-deep .v-tabs-slider {
    display: none !important;
}
::v-deep .v-tab.v-tab--active {
    background-color: #337AB7 !important;
    color: #ffffff !important;
}
.texto-mesa-ocupado {
    color: #ffffff !important;
}
.texto-mesa {
    font-weight: bold; 
    text-transform: uppercase;
}
.div-dialog-modal {
    border: 3px solid #F0F0F0;
    transition: background-color 0.3s ease;
}
.div-dialog-modal:hover {
  background-color: #e0e0e0;
}
.div-dialog-modal:active {
  background-color: #d0d0d0;
}
.div-dialog-modal:focus-within {
  background-color: #c0c0c0;
}

@media (max-width: 450px) {
  .custom-col {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.custom-tab {
    min-width: 200px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    background: #337AB7;
    margin-right: 30px;
    margin-top: 30px;
    margin-bottom: 30px;
}
.custom-tab-size-selected {
    min-width: 200px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    background: #337AB7;
    border-radius: 10px;
}
.custom-tab-size-no-selected {
    min-width: 200px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    background: #FFFFFF;
    border: 1px solid #337AB7;
    color: #337AB7 !important;
    border-radius: 10px;
}
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
        ingresarMontoRules: [
            v => !!v || 'Monto es requerido'
        ],
        ingresarCantidadCuentaSeparadaRules: [
            v => !!v || 'Cantidad es requerida'
        ],
        enviarComandaCocina: false,
        periodoAbiertoValidacion: false,
        manipularDisabledCobrarMonto: false,
        manipularDisabledEnviarCocina: false,
        montoEfectivo: "",
        cantidadCuentaSeparada: "",
        eventoClickVerCuenta: false,
        eventoClickAgregarObservacion: false,
        eventoClickCobrar: false,
        eventoClickCobrarCuentaSeparada: false,
        eventoClickTomarPedido: false,
        tab: null,
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
        listaFormaPago: null,
        productoById: null,
        dialog: false,
        selectedCategory: 1,
        selectProduct: "",
        selectFormaPago: "",
        cantidadPedido: 1,
        observacionPedido: "",
        totalPedido: 0,
        listaMesa: { IDMesa: '' },
        headers: [
            { text: 'Descripción', align: 'start', value: 'descripcion' },
            { text: 'Cantidad', value: 'cantidad' },
            { text: 'Precio', value: 'precio' },
            { text: 'Total', value: 'total' },
            { text: 'Observación', value: 'observacion'},
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        listaProductosSeleccionados: [],
        editedIndex: -1,
        editedItem: {
            descripcion: '',
            cantidad: 0,
            precio: 0,
            total: 0,
            observacion: ''
        },
        defaultItem: {
            descripcion: '',
            cantidad: 0,
            precio: 0,
            total: 0,
            observacion: ''
        },
        listaClientes: [],
        selectCliente: null,
        searchCliente: '',
        modalRegistroCliente: false,
        nuevoCliente: {
            nombre: '',
            dni: '',
            telefono: '',
            email: ''
        },
        cliente: {
            nombre: '',
            dni: '',
            telefono: '',
            email: ''
        },
        clienteEncontrado: false,
        idCliente: '',
        isLoading: false,
        progressValue: 0,
        searchCategory: '',
        searchProduct: '',
        errorMessage: ''
    }),
    async mounted() {
        this.loading = true;
        await this.verificarPeriodoActivo();
        await this.getListCategorias();
        await this.getListMesas();
        await this.getListProductos(this.selectedCategory);
        await this.getListFormaPago();
    },
    computed: {
        optionsCategorias() {
            return this.listaCategorias.map((item) => {
                return {
                    text: item.nombre_categoria,
                    value: item.id_categoria
                };
            }).sort((a, b) => b.count - a.count);
        },
        clienteLabel() {
            return (item) => `${item.nombre} - ${item.dni}`;
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
        this.initialize();

        // Simulando una carga de clientes existentes
        this.listaClientes = [
        { nombre: 'Juan Pérez', dni: '12345678', IDCliente: 1 },
        { nombre: 'Ana García', dni: '87654321', IDCliente: 2 },
        { nombre: 'Carlos Ruiz', dni: '11223344', IDCliente: 3 },
        ];

    },
    methods: {
        clearCliente() {
            this.selectCliente = null;
        },
        abrirModalRegistroCliente() {
            this.modalRegistroCliente = true;
        },
        cerrarModalRegistroCliente() {
            this.modalRegistroCliente = false;
        },
        async registrarCliente() {
            if (!this.nuevoCliente.nombre || !this.nuevoCliente.dni || !this.nuevoCliente.telefono || !this.nuevoCliente.email) {
                this.$swal('Error', 'Todos los campos son obligatorios', 'error');
                return;
            }

            const result = await this.$swal({
                title: '¿Quieres guardar los cambios?',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'swal2-confirm-btn',
                    cancelButton: 'swal2-cancel-btn'
                },
                buttonsStyling: false,
                didRender: () => {
                    const confirmButton = document.querySelector('.swal2-confirm');
                    const cancelButton = document.querySelector('.swal2-cancel');
                    const titleElement = document.querySelector('.swal2-title');

                    if (confirmButton && cancelButton) {
                        confirmButton.style.backgroundColor = '#337AB7';
                        confirmButton.style.color = '#FFFFFF';
                        confirmButton.style.border = 'none';
                        confirmButton.style.padding = '10px 20px';
                        confirmButton.style.size = '16px';
                        confirmButton.style.cursor = 'pointer';
                        confirmButton.style.borderRadius = '10px';
                        confirmButton.style.marginRight = '10px';
                        confirmButton.style.width = '150px';
                        confirmButton.style.height = '50px';

                        cancelButton.style.backgroundColor = '#D9534F';
                        cancelButton.style.color = '#FFFFFF';
                        cancelButton.style.border = 'none';
                        cancelButton.style.padding = '10px 20px';
                        cancelButton.style.size = '16px';
                        cancelButton.style.cursor = 'pointer';
                        cancelButton.style.borderRadius = '10px';
                        cancelButton.style.width = '150px';
                        cancelButton.style.height = '50px';

                        if (window.innerWidth <= 600) {
                            confirmButton.style.marginRight = '0';
                            confirmButton.style.marginBottom = '10px';
                            confirmButton.style.width = '100%';
                            cancelButton.style.width = '100%';
                        }
                    }

                    if (titleElement) {
                        titleElement.style.fontSize = '24px';
                    }
                }
            });

            if (result.isConfirmed) {

                this.isLoading = true;

                try {
                    const response = await this.axios({
                        url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/createCliente',
                        method: 'GET',
                        async: false,
                        params: {
                            "cli_nombres": this.nuevoCliente.nombre,
                            "cli_documento": this.nuevoCliente.dni,
                            "cli_telefono": this.nuevoCliente.telefono,
                            "cli_direccion": "Direccion predeterminada",
                            "cli_email": this.nuevoCliente.email
                        }
                    });

                    if (response.status === 200) {
                        if (response.status == 200) {
                            this.$swal('Cliente creado correctamente', '', 'success')
                            this.cerrarModalRegistroCliente();
                        }
                    }
                } catch (error) {
                    alert('Error en la consulta: ' + error);
                } finally {
                    this.isLoading = false;
                }
            } else if (result.isDenied) {
                this.$swal('Cliente no se pudo crear', '', 'info');
            } else {
                console.log("Error porque no se validó");
            }
        },
        async buscarCliente() {
            const inputLength = this.searchCliente.length;

            if (inputLength === 8 || inputLength === 11) {
                try {
                    this.axios({
                        url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/obtenerCliente',
                        method: 'GET',
                        params: { cli_documento: this.searchCliente }
                    })
                    .then(response => {
                        if (response.data.error.status_code === 200 && response.data.data.length > 0) {
                            const cliente = response.data.data[0];
                            this.cliente = {
                                nombre: cliente.cli_nombres,
                                dni: cliente.cli_documento,
                                telefono: cliente.cli_telefono,
                                email: cliente.cli_email
                            };
                            this.idCliente = cliente.IDCliente;
                            this.clienteEncontrado = true;
                            this.errorMessage = '';
                        } else {
                            if (inputLength === 11) {
                                this.errorMessage = 'Cliente no encontrado. Continúa escribiendo.';
                                console.log("Cliente no encontrado, limpiando...");
                                this.clearCliente();
                            } else {
                                this.errorMessage = 'Cliente no encontrado. Continúa escribiendo.';
                                console.log("Cliente no encontrado, esperando más dígitos...");
                                this.clienteEncontrado = false;
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error al buscar el cliente:', error);
                        this.clearCliente();
                    })
                    .finally(() => (this.loading = false));
                } catch (error) {
                    console.error('Error al buscar el cliente:', error);
                    this.clearCliente();
                }
            } else if (inputLength > 11) {
                this.clearCliente();
            } else {
                this.clienteEncontrado = false;
            }
        },
        clearCliente() {
            this.searchCliente = '';
            this.errorMessage = '';
            this.clienteEncontrado = false;
            this.cliente = {
                nombre: '',
                dni: '',
                telefono: '',
                email: ''
            };
        },
        incrementarCantidad() {
            this.cantidadPedido++;
        },
        decrementarCantidad() {
            if (this.cantidadPedido > 1) {
                this.cantidadPedido--;
            }
        },
        async getListMesas() {
            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/listarMesas',
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
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/listarCategorias',
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
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/listarProductoPorCategoria',
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
        async getListFormaPago() {
            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/listarFormaPago',
                method: 'GET',
                async: false
            })
                .then(response => {
                    this.listaFormaPago = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async cambiarStatusMesa(jsonStatusMesa) {
            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/cambiarStatusMesa',
                method: 'GET',
                async: false,
                params: {
                    "IDStatus": jsonStatusMesa.IDStatus,
                    "IDMesa": jsonStatusMesa.IDMesa
                }
            })
                .then(response => {
                    this.getListMesas();
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        async getProductoById(idProductoSelected) {
            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/getProductoById',
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
            this.eventoClickVerCuenta = !this.eventoClickVerCuenta;
            this.eventoClickCobrar = false;
            this.eventoClickCobrarCuentaSeparada = false;
            this.eventoClickTomarPedido = false;
            this.inicializarEstadosCerrar();

            await this.axios({
                url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/getDatosCabeceraOrdenPedido',
                method: 'GET',
                async: false,
                params: { idMesaSeleccionadaActual }
            })
                .then(response => {
                    this.datosCabeceraOrdenPedido = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => (this.loading = false));
        },
        createCabeceraOrdenPedido(jsonCreateOrdenPedido) {
            this.$swal({
                title: '¿Quieres guardar los cambios?',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'swal2-confirm-btn',
                    cancelButton: 'swal2-cancel-btn'
                },
                buttonsStyling: false,
                didRender: () => {
                    const confirmButton = document.querySelector('.swal2-confirm');
                    const cancelButton = document.querySelector('.swal2-cancel');
                    const titleElement = document.querySelector('.swal2-title');

                    if (confirmButton && cancelButton) {
                        confirmButton.style.backgroundColor = '#337AB7';
                        confirmButton.style.color = '#FFFFFF';
                        confirmButton.style.border = 'none';
                        confirmButton.style.padding = '10px 20px';
                        confirmButton.style.size = '16px';
                        confirmButton.style.cursor = 'pointer';
                        confirmButton.style.borderRadius = '10px';
                        confirmButton.style.marginRight = '10px';
                        confirmButton.style.width = '150px';
                        confirmButton.style.height = '50px';

                        cancelButton.style.backgroundColor = '#D9534F';
                        cancelButton.style.color = '#FFFFFF';
                        cancelButton.style.border = 'none';
                        cancelButton.style.padding = '10px 20px';
                        cancelButton.style.size = '16px';
                        cancelButton.style.cursor = 'pointer';
                        cancelButton.style.borderRadius = '10px';
                        cancelButton.style.width = '150px';
                        cancelButton.style.height = '50px';

                        if (window.innerWidth <= 600) {
                            confirmButton.style.marginRight = '0';
                            confirmButton.style.marginBottom = '10px';
                            confirmButton.style.width = '100%';
                            cancelButton.style.width = '100%';
                        }
                    }

                    if (titleElement) {
                        titleElement.style.fontSize = '24px';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {

                    this.isLoading = true;

                    this.axios({
                        url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/createOrdenPedido',
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
                                this.$swal('Orden de pedido creada correctamente', '', 'success')
                                this.listaMesa.mesa_modelo = false;
                                this.initialize();
                                this.inicializarBotones();

                                let jsonStatusMesa = {
                                    "IDStatus": 2,
                                    "IDMesa": jsonCreateOrdenPedido.IDMesa
                                }

                                this.cambiarStatusMesa(jsonStatusMesa);
                                this.datosCabeceraOrdenPedido = null;
                                this.manipularDisabledEnviarCocina = false;
                            }
                        })
                        .catch(function (error) {
                            alert("Error en el sistema, comunicate con soporte técnico");
                        })
                        .finally(() => (this.isLoading = false));
                } else if (result.isDenied) {
                    this.$swal('Orden de pedido no se pudo crear', '', 'info');
                    this.manipularDisabledEnviarCocina = false;
                } else {
                    this.manipularDisabledEnviarCocina = false;
                }
            })
        },
        async cobrarPedidoMesaSeleccionada(idMesaSeleccionadaActual) {
            this.manipularDisabledCobrarMonto = true;
            let valueFormaPago = this.selectFormaPago;
            let valueselectFormaPago = this.selectFormaPago;
            let valueVueltoPago = 0;
            let valueMontoEfectivo = this.montoEfectivo;
            let valueClienteID = this.idCliente;

            const result = await this.$swal({
                title: '¿Quieres guardar los cambios?',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'swal2-confirm-btn',
                    cancelButton: 'swal2-cancel-btn'
                },
                buttonsStyling: false,
                didRender: () => {
                    const confirmButton = document.querySelector('.swal2-confirm');
                    const cancelButton = document.querySelector('.swal2-cancel');
                    const titleElement = document.querySelector('.swal2-title');

                    if (confirmButton && cancelButton) {
                        confirmButton.style.backgroundColor = '#337AB7';
                        confirmButton.style.color = '#FFFFFF';
                        confirmButton.style.border = 'none';
                        confirmButton.style.padding = '10px 20px';
                        confirmButton.style.size = '16px';
                        confirmButton.style.cursor = 'pointer';
                        confirmButton.style.borderRadius = '10px';
                        confirmButton.style.marginRight = '10px';
                        confirmButton.style.width = '150px';
                        confirmButton.style.height = '50px';

                        cancelButton.style.backgroundColor = '#D9534F';
                        cancelButton.style.color = '#FFFFFF';
                        cancelButton.style.border = 'none';
                        cancelButton.style.padding = '10px 20px';
                        cancelButton.style.size = '16px';
                        cancelButton.style.cursor = 'pointer';
                        cancelButton.style.borderRadius = '10px';
                        cancelButton.style.width = '150px';
                        cancelButton.style.height = '50px';

                        if (window.innerWidth <= 600) {
                            confirmButton.style.marginRight = '0';
                            confirmButton.style.marginBottom = '10px';
                            confirmButton.style.width = '100%';
                            cancelButton.style.width = '100%';
                        }
                    }

                    if (titleElement) {
                        titleElement.style.fontSize = '24px';
                    }
                }
            });

            if (result.isConfirmed) {
                this.isLoading = true;

                try {
                    const response = await this.axios({
                        url: process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/cobrarPedidoMesaSeleccionada',
                        method: 'GET',
                        params: { idMesaSeleccionadaActual, valueFormaPago, valueClienteID }
                    });

                    if (response.status === 200) {
                        if (valueselectFormaPago === 1) {
                            valueVueltoPago = valueMontoEfectivo - response.data.data.cfac_monto_total;
                            this.$swal('Nota de venta creada correctamente, su vuelto es: ' + valueVueltoPago, '', 'success');
                        } else {
                            this.$swal('Nota de venta creada correctamente', '', 'success');
                        }

                        this.listaMesa.mesa_modelo = false;
                        this.datosCabeceraOrdenPedido = null;
                        this.initialize();
                        this.inicializarEstadosCerrar();

                        let jsonStatusMesa = {
                            "IDStatus": 1,
                            "IDMesa": idMesaSeleccionadaActual
                        };

                        this.cambiarStatusMesa(jsonStatusMesa);
                        this.manipularDisabledCobrarMonto = false;
                        this.idCliente = '';
                        this.clearCliente();
                    }
                } catch (error) {
                    alert('Error en la consulta: ' + error);
                } finally {
                    this.manipularDisabledCobrarMonto = false;
                    this.isLoading = false;
                }
            } else if (result.isDenied) {
                this.$swal('El pago no se pudo procesar', '', 'info');
                this.manipularDisabledCobrarMonto = false;
            } else {
                this.manipularDisabledCobrarMonto = false;
            }
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
        validacionAgregarCuenta() {
            this.eventoClickAgregarObservacion = !this.eventoClickAgregarObservacion;
        },
        enviarMensajeTextoCliente() {
            console.log("probando el envio");
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
                total: sumaMonto,
                observacion: this.observacionPedido
            }

            this.listaProductosSeleccionados.push(agregarListaObjeto)
            this.selectProduct = "";
            this.eventoClickAgregarObservacion = false;
            this.observacionPedido = "";
            this.totalDetalle();
        },
        initialize() {
            this.listaProductosSeleccionados = [];
            this.selectProduct = "";
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

                this.manipularDisabledEnviarCocina = false;
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
            this.manipularDisabledEnviarCocina = true;
            this.idMesaSelected = mesaSeleccionada;
            this.$emit('toggle-favorite');
            this.crearOrdenPedido();
        },
        eventoCobrarMonto() {
            this.eventoClickCobrar = !this.eventoClickCobrar;
            this.eventoClickCobrarCuentaSeparada = false;
            this.eventoClickVerCuenta = false;
            this.eventoClickTomarPedido = false;
            console.log(this.eventoClickCobrar);
            this.inicializarEstadosCerrar();
        },
        eventoCobrarMontoCuentaSeparada() {
            this.eventoClickCobrarCuentaSeparada = !this.eventoClickCobrarCuentaSeparada;
            this.eventoClickCobrar = false;
            this.eventoClickVerCuenta = false;
            this.eventoClickTomarPedido = false;
        },
        eventoAumentarPedido() {
            this.eventoClickTomarPedido = !this.eventoClickTomarPedido;
            this.eventoClickVerCuenta = false;
            this.eventoClickCobrar = false;
            this.eventoClickCobrarCuentaSeparada = false;
            this.inicializarEstadosCerrar();
        },
        inicializarBotones() {
            this.eventoClickVerCuenta = false;
            this.eventoClickTomarPedido = false;
            this.eventoClickCobrar = false;
            this.inicializarEstadosCerrar();
        },
        inicializarEstadosCerrar() {
            this.selectProduct = "";
            this.montoEfectivo = "";
            this.selectFormaPago = "";
            this.listaProductosSeleccionados = [];
            this.cantidadCuentaSeparada = "";
        },
    }
}
</script>