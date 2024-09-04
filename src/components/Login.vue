<template>
  <div style="padding: 0px">
    <v-overlay
      :value="isLoading"
      :style="{
        zIndex: 9999,
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100vh',
      }"
    >
      <div
        style="display: flex; justify-content: center; align-items: center; height: 100%"
      >
        <v-progress-circular
          color="primary"
          :size="78"
          :width="12"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-overlay>

    <section class="bg-gray-50 dark:bg-gray-900">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
              style="text-align: center"
            >
              Iniciar Sesión
            </h1>
            <form class="space-y-4 md:space-y-6" @submit.prevent="iniciarSesion">
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Usuario</label
                >
                <input
                  type="email"
                  v-model="usuario"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="nombre@gmail.com"
                  required=""
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Contraseña</label
                >
                <input
                  type="password"
                  v-model="clave"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="remember" class="text-gray-500 dark:text-gray-300"
                      >Recordar cuenta</label
                    >
                  </div>
                </div>
                <a
                  href="#"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >¿Olvidaste tu contraseña?</a
                >
              </div>
              <button
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Acceder
              </button>
            </form>

            <v-alert
              color="error"
              icon="$error"
              title="Alerta de error"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus..."
              v-if="error"
              >{{ mensajeError }}</v-alert
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.flex,
.child-flex > * {
  flex: none;
}
</style>

<script>
export default {
  name: "Login",
  data() {
    return {
      usuario: "",
      clave: "",
      accesoUsuario: null,
      loading: false,
      error: false,
      mensajeError: "",
      isLoading: false,
    };
  },
  methods: {
    async iniciarSesion() {
      var payload = {
        usuario: this.usuario,
        clave: this.clave,
      };

      this.isLoading = true;

      console.log(payload);

      try {
        const response = await this.axios({
          url:
            process.env.VUE_APP_DIRECCION_API_ADMINISTRADOR + "/api/auth/iniciarSesion",
          method: "GET",
          params: payload,
        });

        console.log("aqui");
        console.log(response.data.data);

        if (response.data.data != null) {
          this.$cookies.set("tokenauth", "valortoken123", "12h");
          this.$router.push("dashboard");
          this.error = false;
        } else {
          this.error = true;
          this.mensajeError = response.data.error.msg;
        }
      } catch (error) {
        console.log(error);

        if (error.response) {
          this.error = true;
          this.mensajeError = error.response.data.error.msg || "Error desconocido";
        } else if (error.request) {
          this.error = true;
          this.mensajeError = "No se recibió respuesta del servidor.";
        } else {
          this.error = true;
          this.mensajeError = "Error al configurar la solicitud.";
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
