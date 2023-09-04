<template>
    <!--     <div class="row">
        <div class="col m12 card-panel">
            <form @submit.prevent="iniciarSesion">
                <div class="row">
                    <div class="col m3">
                        <label>Usuario</label>
                        <input type="text" v-model="usuario">
                    </div>
                </div>
                <div class="row">
                    <div class="col m3">
                        <label>Contraseña</label>
                        <input type="password" v-model="clave">
                    </div>
                </div>
                <div class="row">
                    <div class="col m3">
                        <button type="submit" class="btn">INICIAR SESIÓN<i class="material-icons right">security</i></button>
                    </div>
                </div>
            </form>
        </div>
    </div> -->

    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Iniciar Sesión
                    </h1>
                    <form class="space-y-4 md:space-y-6" @submit.prevent="iniciarSesion">
                        <div>
                            <label for="email"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario</label>
                            <input type="email" v-model="usuario"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="nombre@gmail.com" required="">
                        </div>
                        <div>
                            <label for="password"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                            <input type="password" v-model="clave" placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required="">
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                        required="">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-500 dark:text-gray-300">Recordar cuenta</label>
                                </div>
                            </div>
                            <a href="#"
                                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">¿Olvidaste
                                tu contraseña?</a>
                        </div>
                        <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 
                                    font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 
                                    dark:focus:ring-primary-800">
                            Acceder
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.flex,
.child-flex>* {
    flex: none;
}
</style>

<script>
export default
    {
        name: 'Login',
        data() {
            return {
                usuario: '',
                clave: '',
                accesoUsuario: null
            }
        },
        methods: {
            iniciarSesion() {
                var payload = {
                    "usuario": this.usuario,
                    "clave": this.clave
                };

                this.axios
                .post(process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/iniciarSesion', payload,
                        {
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            }
                        })
                    .then(response => (this.accesoUsuario = response.data.data))

                this.axios
                .get(process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + '/api/auth/listarMesas')
                    .then(response => (this.listaMesas = response.data.data))
            }
        }
    }
</script>