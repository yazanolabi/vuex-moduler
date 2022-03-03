<script>
import moduler from "./utils/moduler";
import { mapActions, mapGetters } from "vuex";
export default {
	name: "VuexModuler",
	props: {
		resource: { type: String, required: true, default: "" },
		namespace: { type: String, required: true, default: "" },
		api: { type: String },
	},
	data() {
		return {};
	},
	beforeDestroy() {
		this.$store.unregisterModule(this.namespace);
	},
	created() {
		this.registerModule();
	},
	computed: {
		module() {
			return this.namespace;
		},
		...mapGetters(this.namespace, ["all", "infinite", "paginated", "item"]),
	},
	methods: {
		registerModule() {
			return new Promise((resolve) => {
				resolve(
					this.$store.registerModule(
						this.namespace,
						moduler({ api: this.api ? this.api : this.resource }),
					),
				);
			});
		},
		...mapActions(this.namespace, [
			"get",
			"show",
			"create",
			"edit",
			"destroy",
			"disable",
			"activate",
			"exportExcel",
		]),
	},
	render() {
		return this.$scopedSlots.default({
			module: this.module,
		});
	},
};
</script>
