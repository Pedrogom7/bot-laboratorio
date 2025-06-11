const fetchLabs = require('./fetchlabs');

(async () => {
  const mensagem = await fetchLabs();
  console.log(mensagem);
})();