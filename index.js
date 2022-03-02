module.exports = function moduler({
	axios,
	api = "",
	files = false,
	actions = {},
	getters = {},
	mutations = {},
	state = {},
} = {}) {
	return {
		namespaced: true,
		actions: {
			get: async ({ commit }, data) => {
				return await new Promise((resolve, reject) => {
					axios
						.get(api, { params: data })
						.then((res) => {
							if (data && data.infinite)
								commit("fetchInfinite", res.data);
							else if (data && data.rowsPerPage)
								commit("fetch", res.data);
							else commit("fetchAll", res.data);
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			show: async ({ commit }, id) => {
				return await new Promise((resolve, reject) => {
					axios
						.get(`${api}/${id}`)
						.then((res) => {
							commit("fetchOne", res.data);
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			create: async ({ commit }, data) => {
				return await new Promise((resolve, reject) => {
					if (files) {
						data = objectToForm(data);
					}
					axios
						.post(api, data)
						.then((res) => {
							commit("add", res.data);
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			edit: async ({ commit }, data) => {
				if (files) {
					let formData = objectToForm(data);
					formData.append("_method", "PATCH");
				}
				return await new Promise((resolve, reject) => {
					axios({
						method: files ? "post" : "put",
						url: `${api}/${data.id}`,
						data: files ? formData : data,
					})
						.then((res) => {
							commit("update", res.data);
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			destroy: async ({ commit }, id) => {
				return await new Promise((resolve, reject) => {
					axios
						.delete(`${api}/${id}`)
						.then((res) => {
							commit("remove", id);
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			disable: async ({ commit }, id) => {
				return await new Promise((resolve, reject) => {
					axios
						.post(`${api}/disable?id=${id}`)
						.then((res) => {
							commit("disable", id);
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			activate: async ({ commit }, id) => {
				return await new Promise((resolve, reject) => {
					axios
						.post(`${api}/activate?id=${id}`)
						.then((res) => {
							commit("activate", id);
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			exportExcel: async ({ commit }, data) => {
				return await new Promise((resolve, reject) => {
					axios
						.get(`${api}/export/excel`, {
							params: data,
							responseType: "blob",
						})
						.then((res) => {
							let fileURL = window.URL.createObjectURL(
								new Blob([res.data]),
							);
							let fileLink = document.createElement("a");
							let filename = `${api.replace(/\\|\//g, "")}.xlsx`;
							fileLink.href = fileURL;
							fileLink.setAttribute("download", filename);
							document.body.appendChild(fileLink);
							fileLink.click();
							document
								.querySelector(`[download="${filename}"]`)
								.remove();
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			...actions,
		},
		getters: {
			all: (state) => state.all,
			infinite: (state) => state.infinite,
			paginated: (state) => state.paginated,
			item: (state) => state.item,
			...getters,
		},
		mutations: {
			fetch: (state, res) => {
				state.paginated = res.data.data ? res.data.data : res.data;
			},

			fetchInfinite: (state, res) => {
				state.infinite = [
					...state.infinite,
					...(res.data.data ? res.data.data : res.data),
				];
			},

			fetchAll: (state, res) => {
				state.all = res.data.data ? res.data.data : res.data;
			},

			fetchOne: (state, res) => {
				state.item = res.data.data ? res.data.data : res.data;
			},

			add: (state, res) => {
				state.paginated.push(res.data.data);
				state.infinite.unshift(res.data.data);
				state.all.push(res.data.data);
			},

			update: (state, res) => {
				const find = (element) => element.id == res.data.data.id;
				const index = state.paginated.findIndex(find);
				Vue.set(state.paginated, index, res.data.data);
				const index2 = state.infinite.findIndex(find);
				Vue.set(state.infinite, index2, res.data.data);
				const index3 = state.all.findIndex(find);
				Vue.set(state.all, index3, res.data.data);
				if (state.item.id == res.data.data.id) {
					state.item = Object.assign({}, res.data.data);
				}
			},

			disable: (state, id) => {
				const find = (element) => element.id == id;
				const index = state.paginated.findIndex(find);
				Vue.set(state.paginated[index], "active", 0);
			},

			activate: (state, id) => {
				const find = (element) => element.id == id;
				const index = state.paginated.findIndex(find);
				Vue.set(state.paginated[index], "active", 1);
			},

			remove: (state, id) => {
				const find = (element) => element.id == id;
				const index = state.paginated.findIndex(find);
				state.paginated.splice(index, 1);
				const index2 = state.infinite.findIndex(find);
				state.infinite.splice(index2, 1);
				const index3 = state.all.findIndex(find);
				state.all.splice(index3, 1);
			},

			empty: (state) => {
				state.all = [];
				state.paginated = [];
				state.infinite = [];
				state.item = {};
			},

			...mutations,
		},
		state: () => ({
			all: [],
			infinite: [],
			paginated: [],
			item: {},
			...state,
		}),
	};
};
