(function (global) {
  if (!global.axios) {
    throw new Error('Axios is required to initialize API client.');
  }

  const apiClient = global.axios.create({
    baseURL: 'http://localhost:3000'
  });

  global.KontramarkaApi = {
    apiClient
  };
})(window);
