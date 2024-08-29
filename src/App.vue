<template>
    <v-app id="inspire" dark>
            <v-navigation-drawer
                v-model="drawer"
                :clipped="$vuetify.breakpoint.lgAndUp"
                app
                dark
                v-if="valorRuta != '/'"
            >
            <v-list dense>
                <template>
                    <v-list-item class="px-2">
                        <v-list-item-avatar>
                            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-title>Administrador</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item
                        v-for="(item, index) in items"
                        :key="index"
                        v-if="!item.subItems"
                        :to="{ name: item.action }"
                        ref="estadoActivo"
                    >
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-title class="nav-title">
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-group
                        v-for="(item, index) in items"
                        :key="index"
                        v-if="item.subItems"
                        prepend-icon
                    >
                        <template v-slot:activator>
                            <v-list-item>
                                <v-list-item-action>
                                <v-icon>{{ item.icon }}</v-icon>
                                </v-list-item-action>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </template>

                        <v-list-item
                            v-for="(subItem, subIndex) in item.subItems"
                            :key="subIndex"
                            :to="{ name: subItem.action }"
                            style="padding-left: 32px"
                        >
                            <v-list-item-action>
                                <v-icon>{{ subItem.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            color="blue darken-3"
            dark
            app
            fixed
            :style="{ 'max-height': '56px' }"
            v-if="valorRuta != '/'"
        >
            <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <span class="hidden-sm-and-down">La tete restobar</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn @click="closeSession" icon style="margin-right: 12px"
                ><v-icon>logout</v-icon></v-btn
            >
        </v-toolbar>

        <v-content>
            <v-container fluid>
                <v-slide-y-transition mode="out-in">
                <router-view />
                </v-slide-y-transition>
            </v-container>
        </v-content>
    </v-app>
</template>

<style scoped>
.v-list-group .v-list-item {
  padding-left: 0px;
}

.v-list-group .v-list-item__title {
  margin-left: 0px;
}

.v-list .v-list-item--active {
    color: white !important;
}

.v-list .v-list-item--active .v-icon {
    color: white !important;
}
</style>

<script>
export default {
  name: "App",
  data: () => ({
    dialog: false,
    drawer: null,
    valorRuta: null,
    items: [
      {
        action: "dashboard",
        icon: "attachment",
        title: "Inicio",
      },
      {
        action: "pedidos",
        icon: "moped",
        title: "Pedidos",
        subItems: [{ action: "mesas", icon: "list", title: "Mesas" }],
      },
      {
        action: "cocina",
        icon: "flatware",
        title: "Cocina",
      },
      {
        action: "administracion",
        icon: "beenhere",
        title: "Administracion",
      },
      {
        action: "gastos",
        icon: "beenhere",
        title: "Gastos",
      }
    ]
  }),
  methods: {
    getSession() {
      this.valorRuta = this.$route.path;

      if (this.$cookies.get("tokenauth") == null) {
        this.$router.push("/").catch(() => {});
      } else {
        if (this.$route.path === "/") {
          this.$refs.estadoActivo[0].$el.classList.add("v-list-item--active");
        } else {
          this.$refs.estadoActivo[0].$el.classList.remove("v-list-item--active");
        }
      }
    },
    closeSession() {
      this.$cookies.remove("tokenauth");
      this.$router.push("/");
    }
  },
  created: function () {
    this.getSession();
  },
  updated: function () {
    this.getSession();
  }
};
</script>
