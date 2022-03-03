import VuexModuler from "./vuex-moduler.vue";

function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component("VuexModuler", VuexModuler);
}

const plugin = {
	install,
};

let GlobalVue = null;
if (typeof window !== "undefined") {
	GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
	GlobalVue = global.vue;
}

if (GlobalVue) {
	GlobalVue.use(plugin);
}

VuexModuler.install = install;

export default {
	VuexModuler,
	moduler,
};
