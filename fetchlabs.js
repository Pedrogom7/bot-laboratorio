const puppeteer = require('puppeteer');

async function fetchLabs() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Abrindo página...');
  await page.goto('https://app.unicesumar.edu.br/presencial/forms/informatica/?siteorigem=formulario-pre-inscricao-site', {
    waitUntil: 'domcontentloaded'
  });

  console.log('Página carregada. Esperando mais 3 segundos para garantir...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Aguardando seletor td.noite a...');

  try {
    await page.waitForSelector('td.noite a', { timeout: 15000 });
    const botaoNoite = await page.$('td.noite a');

    if (botaoNoite) {
      console.log('Botão NOITE encontrado. Clicando...');
      await botaoNoite.evaluate(el => el.scrollIntoView());
      await botaoNoite.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.error('Não conseguiu encontrar o botão NOITE.');
      await browser.close();
      return '❌ Não conseguiu encontrar o botão NOITE.';
    }
  } catch (e) {
    console.error('Não conseguiu encontrar ou clicar no botão NOITE:', e);
    await browser.close();
    return '❌ Não conseguiu encontrar ou clicar na aba NOITE.';
  }

  console.log('Aguardando carregar a tabela...');

  try {
    await page.waitForSelector('table.tableReserva', { visible: true, timeout: 10000 });
  } catch (e) {
    console.error('Tabela não carregou:', e);
    await browser.close();
    return '❌ A tabela não carregou.';
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Extraindo agendamentos...');

  const agendamentos = await page.evaluate(() => {
    const tabelas = Array.from(document.querySelectorAll('table.tableReserva'));
    const resultados = [];

    //regex contendo: 
    // 1 - Nome do Curso "ESOFT"
    // 2 - Semestre "3"
    // 3 - Letra da Turma "C"
    const regex = /(?=.*ESOFT)(?=.*4)(?=.*C)/i;

    tabelas.forEach(tabela => {
      // 1. Identifica o lab
      let lab = 'LAB não identificado';
      const tdLab = tabela.querySelector('td');
      if (tdLab && tdLab.innerText.includes('LAB')) {
        lab = tdLab.innerText.trim();
      }

      // 2. Sobe no DOM e identifica o bloco
      let bloco = 'Bloco não identificado';
      let el = tabela;
      while (el) {
        const th = el.querySelector && el.querySelector('th');
        if (th && th.innerText.toUpperCase().includes('BLOCO')) {
          bloco = th.innerText.trim();
          break;
        }
        el = el.previousElementSibling || el.parentElement;
      }

      // 3. Percorre os div.reserva e identifica por índice se é 1º ou 2º horário
      const reservas = Array.from(tabela.querySelectorAll('div.reserva'));
      reservas.forEach((div, index) => {
        const texto = div.innerText.trim();
        if (regex.test(texto)) {
          const partes = texto.split('\n').filter(Boolean);
          const professor = partes[0] || 'Professor não identificado';
          const horario = index === 0 ? 'primeiro' : 'segundo';

          resultados.push({
            horario,
            bloco,
            lab,
            professor
          });
        }
      });
    });

    return resultados;
  });

  await browser.close();

  console.log('Resultado extração:', agendamentos);

  console.log('Processando mensagem...');

  const hoje = new Date();
  const dia = hoje.getDate().toString().padStart(2, '0');
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const ano = hoje.getFullYear();
  const dataHoje = `${dia}/${mes}/${ano}`;

  let mensagem = `🚨 *LABORATÓRIO (${dataHoje})* 🚨\n\n`;

  const primeiroHorario = agendamentos.filter(a => a.horario === 'primeiro');
  const segundoHorario = agendamentos.filter(a => a.horario === 'segundo');

  mensagem += `⏰ *PRIMEIRO HORÁRIO*\n`;
  if (primeiroHorario.length === 0) {
    mensagem += `🛑 *Nenhum agendamento.*\n\n`;
  } else {
    primeiroHorario.forEach(ag => {
      mensagem += `🏫 ${ag.bloco} - 🖥️ ${ag.lab}\n👨‍🏫 ${ag.professor}\n\n`;
    });
  }

  mensagem += `⏰ *SEGUNDO HORÁRIO*\n`;
  if (segundoHorario.length === 0) {
    mensagem += `🛑 *Nenhum agendamento.*\n\n`;
  } else {
    segundoHorario.forEach(ag => {
      mensagem += `🏫 ${ag.bloco} - 🖥️ ${ag.lab}\n👨‍🏫 ${ag.professor}\n\n`;
    });
  }

  return mensagem;
}

module.exports = fetchLabs;