const baseURL = 'http://192.168.252.99:8000/api';

const sakilaConfig = {
  baseURL,

  auth:{
    login:`${baseURL}/login-step1`,
    twofactorauth:`${baseURL}/login-step2`,
    logut:`${baseURL}/logout`,
    passwordrecuperation:`${baseURL}/passwd`,
    me:`${baseURL}/me`,
    storageTokenKeyName: 'token',
  },

  staff: {
    getAll: `${baseURL}/staff`,
    create: `${baseURL}/staff`,
    getById: (id) => `${baseURL}/staff/${id}`,
    update: (id) => `${baseURL}/staff/${id}`,
    delete: (id) => `${baseURL}/staff/${id}`,
  },

  customers: {
    getAll: `${baseURL}/customers`,
    create: `${baseURL}/customers`,
    getById: (id) => `${baseURL}/customers/${id}`,
    update: (id) => `${baseURL}/customers/${id}`,
    delete: (id) => `${baseURL}/customers/${id}`,
  },

  actors: {
    getAll: `${baseURL}/actors`,
    create: `${baseURL}/actors`,
    getById: (id) => `${baseURL}/actors/${id}`,
    update: (id) => `${baseURL}/actors/${id}`,
    delete: (id) => `${baseURL}/actors/${id}`,
  },

  films: {
    getAll: `${baseURL}/films`,
    create: `${baseURL}/films`,
    getById: (id) => `${baseURL}/films/${id}`,
    update: (id) => `${baseURL}/films/${id}`,
    delete: (id) => `${baseURL}/films/${id}`,
  },

  categories: {
    getAll: `${baseURL}/categories`,
    create: `${baseURL}/categories`,
    getById: (id) => `${baseURL}/categories/${id}`,
    update: (id) => `${baseURL}/categories/${id}`,
    delete: (id) => `${baseURL}/categories/${id}`,
  },

  film_actors: {
    getAll: `${baseURL}/film_actors`,
    create: `${baseURL}/film_actors`,
    getById: (id) => `${baseURL}/film_actors/${id}`,
    update: (id) => `${baseURL}/film_actors/${id}`,
    delete: (id) => `${baseURL}/film_actors/${id}`,
  },

  rentals: {
    getAll: `${baseURL}/rentals`,
    create: `${baseURL}/rentals`,
    getById: (id) => `${baseURL}/rentals/${id}`,
    update: (id) => `${baseURL}/rentals/${id}`,
    delete: (id) => `${baseURL}/rentals/${id}`,
  },

  payments: {
    getAll: `${baseURL}/payments`,
    create: `${baseURL}/payments`,
    update: (id) => `${baseURL}/payments/${id}`,
    delete: (id) => `${baseURL}/payments/${id}`,
    getById: (id) => `${baseURL}/payments/${id}`,
  },

  languages: {
    getAll: `${baseURL}/languages`,
    create: `${baseURL}/languages`,
    update: (id) => `${baseURL}/languages/${id}`,
    delete: (id) => `${baseURL}/languages/${id}`,
    getById: (id) => `${baseURL}/languages/${id}`,
  },

  stores: {
    getAll: `${baseURL}/stores`,
    create: `${baseURL}/stores`,
    update: (id) => `${baseURL}/stores/${id}`,
    delete: (id) => `${baseURL}/stores/${id}`,
    getById: (id) => `${baseURL}/stores/${id}`,
  },

  inventory: {
    getAll: `${baseURL}/inventory`,
    create: `${baseURL}/inventory`,
    update: (id) => `${baseURL}/inventory/${id}`,
    delete: (id) => `${baseURL}/inventory/${id}`,
    getById: (id) => `${baseURL}/inventory/${id}`,
  },
    countries: {
      getAll: `${baseURL}/countries`,
      create: `${baseURL}/countries`,
      getById: (id) => `${baseURL}/countries/${id}`,
      update: (id) => `${baseURL}/countries/${id}`,
      delete: (id) => `${baseURL}/countries/${id}`
    },
    cities: {
      getAll: `${baseURL}/cities`,
      create: `${baseURL}/cities`,
      getById: (id) => `${baseURL}/cities/${id}`,
      update: (id) => `${baseURL}/cities/${id}`,
      delete: (id) => `${baseURL}/cities/${id}`
    },
    addresses: {
      getAll: `${baseURL}/addresses`,
      create: `${baseURL}/addresses`,
      getById: (id) => `${baseURL}/addresses/${id}`,
      update: (id) => `${baseURL}/addresses/${id}`,
      delete: (id) => `${baseURL}/addresses/${id}`
    },

  reports: {
    salesByCategory: `${baseURL}/reports/sales-by-category`,
    topCustomers: `${baseURL}/reports/top-customers`,
    inventoryStatus: `${baseURL}/reports/inventory-status`
  }
};

export default sakilaConfig;
