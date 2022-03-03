export default ({
	axios,
	api = "",
	actions = {},
	getters = {},
	mutations = {},
	state = {},
} = {}) => {
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
				return await new Promise((resolve, reject) => {
					axios({
						method: "put",
						url: `${api}/${data.id}`,
						data,
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
						.post(`${api}/${id}/disable`)
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
						.post(`${api}/${id}/activate`)
						.then((res) => {
							commit("activate", id);
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			},

			exportExcel: async (data) => {
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
			fetch: (state, { data }) => {
				state.paginated = data;
			},

			fetchInfinite: (state, { data }) => {
				state.infinite = [...state.infinite, ...data];
			},

			fetchAll: (state, { data }) => {
				state.all = data;
			},

			fetchOne: (state, { data }) => {
				state.item = data;
			},

			add: (state, { data }) => {
				state.paginated.push(data);
				state.infinite.unshift(data);
				state.all.push(data);
			},

			update: (state, { data }) => {
				const find = (element) => element.id == data.id;
				const index = state.paginated.findIndex(find);
				state.paginated[index] = Object.assign({}, data);
				const index2 = state.infinite.findIndex(find);
				state.infinite[index2] = Object.assign({}, data);
				const index3 = state.all.findIndex(find);
				state.all[index3] = Object.assign({}, data);
				if (state.item.id == data.id) {
					state.item = Object.assign({}, data);
				}
			},

			disable: (state, id) => {
				const find = (element) => element.id == id;
				const index = state.paginated.findIndex(find);
				state.paginated[index].active = 0;
			},

			activate: (state, id) => {
				const find = (element) => element.id == id;
				const index = state.paginated.findIndex(find);
				state.paginated[index].active = 1;
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
