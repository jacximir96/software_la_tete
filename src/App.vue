<template>
    <v-app id="inspire" dark>
        <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app dark>
            <v-list dense>
                <template>
                    <v-list-item class="px-2">
                        <v-list-item-avatar>
                            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-title>Administrador - lateterestobar</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item v-if="item.action == 'home'" v-for="(item, index) in items" :key="index"
                        :to="{ name: item.action }" ref="estadoActivo">
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-title class="nav-title">
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="item.action != 'home'" v-for="(item, index) in items" :key="index"
                        :to="{ name: item.action }">
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-title class="nav-title">
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed
            :style="{ 'max-height': '56px' }">
            <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <span class="hidden-sm-and-down">La tete restobar</span>
            </v-toolbar-title>
        </v-toolbar>

        <v-content>
            <v-container fluid>
                <v-slide-y-transition mode="out-in">
                    <router-view />
                </v-slide-y-transition>
            </v-container>
        </v-content>
        <!-- <router-view/> -->
    </v-app>
</template>

<script>

export default {
    name: 'App',
    data: () => ({
        dialog: false,
        drawer: null,
        items: [
            { icon: 'attachment', title: 'Inicio', action: 'home' },
            { icon: 'moped', title: 'Pedidos', action: 'mesas' },
            { icon: 'flatware', title: 'Cocina', action: 'cocina' }
        ]
    }),
    methods: {
        getSession() {
            if (this.$route.path === "/") {
                this.$refs.estadoActivo[0].$el.classList.add("v-list-item--active");
            } else {
                this.$refs.estadoActivo[0].$el.classList.remove("v-list-item--active");
            }
        }
    },
    created: function () {
        this.getSession()
    },
    updated: function () {
        this.getSession()
    }
};
</script>
