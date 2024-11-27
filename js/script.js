let currentId = 1; // Variável para armazenar o ID do Pokémon pesquisado

function getPokemon(valor) {
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${valor}`,
    method: "get",
    dataType: "json"
  })
  .done(function(data) {
    let content = "";

    // Verifica se o Pokémon tem um ou dois tipos
    const tipo1 = data.types[0]?.type.name || '';  // Tipo 1
    const tipo2 = data.types[1]?.type.name || '';  // Tipo 2 (caso exista)

    // Condicional para um ou dois tipos
    if (data.types.length === 1) {
      content += `<div class="todo ${tipo1}"></div>`; // Quando tem apenas um tipo
    } else {
      content += ` 
        <div class="meia-esquerda ${tipo1}"></div>
        <div class="meia-direita ${tipo2}"></div>
      `; // Quando tem dois tipos
    }

    // Atualiza imagem do Pokémon
    const importaImagemPokemon = $("#importaImagemPokemon");
    content += `<div class="imagemPokemon">
                  <img alt="" src="${data.sprites.front_default}">
                </div>`;
    importaImagemPokemon.html(content);

    // Exibe dados do Pokémon
    const importaDadosPokemon = $("#importaDadosPokemon");
    const alturaEmCm = data.height * 10;
    const alturaFormatada = alturaEmCm > 100 ? (alturaEmCm / 100).toFixed(2).replace(".", ",") + " m" : alturaEmCm + " cm";
    const pesoEmKg = data.weight / 10;
    const pesoFormatado = pesoEmKg >= 1 ? pesoEmKg.toFixed(2).replace(".", ",") + " kg" : (pesoEmKg * 1000).toFixed(0) + " g";

    content = `
      <p><span>ID</span><span>${data.id}</span></p>
      <p><span>Nome</span><span>${data.name}</span></p>
      <p><span>Altura</span><span>${alturaFormatada}</span></p>
      <p><span>Peso</span><span>${pesoFormatado}</span></p>
      <p><span>Tipo</span><span>${data.types.map(({ type }) => type.name).join(" / ")}</span></p>
    `;
    importaDadosPokemon.html(content);

    // Reproduz o cry do Pokémon pesquisado
    new Audio(`https://play.pokemonshowdown.com/audio/cries/${data.name.toLowerCase()}.mp3`).play();

    // Descrição do Pokémon
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`,
      method: "get",
      dataType: "json"
    }).done(function(speciesData) {
      const descricao = speciesData.flavor_text_entries.find(entry => entry.language.name === "pt-BR") || 
                  speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
      const descricaoLimpa = descricao ? descricao.flavor_text.replace(/[\x00-\x1F\x7F\x0C]/g, ' ').replace(/\.(?=\S)/g, '. ') : "Descrição não disponível";
      $("#importaDescricaoPokemon").html(`<p>${descricaoLimpa}</p>`);
    });

    // Obter fraquezas e resistências dos tipos
    const tipos = data.types.map(t => t.type.name);
    tipos.forEach(tipo => {
      $.ajax({
        url: `https://pokeapi.co/api/v2/type/${tipo}`,
        method: "get",
        dataType: "json"
      }).done(function(typeData) {
        let fraquezas = new Set();
        let resistencias = new Set();

        // Fraquezas
        typeData.damage_relations.double_damage_from.forEach(weakness => {
          fraquezas.add(weakness.name);
        });

        // Resistências
        typeData.damage_relations.half_damage_from.forEach(resistance => {
          resistencias.add(resistance.name);
        });

        // Exibe fraquezas com <span> para cada uma
        let content = '<p><span class="fraqueza">Fraquezas:</span><br>';
        fraquezas.forEach(weakness => {
          content += `<span>${weakness} </span>`;
        });
        content += '</p>';
        $("#importaFraquezaPokemon").html(content);

        // Exibe resistências com <span> para cada uma
        content = '<p><span class="resistencia">Resistências:</span><br>';
        resistencias.forEach(resistance => {
          content += `<span>${resistance} </span>`;
        });
        content += '</p>';
        $("#importaResistenciaPokemon").html(content);
      });
    });

    // Função para gerar as estatísticas aleatórias
    function gerarEstatisticas() {
      const viu = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;
      const pegou = Math.floor(Math.random() * (viu + 1));
      const enfrentou = Math.floor(Math.random() * (viu + 1));
      const usou = pegou === 0 ? 0 : Math.floor(Math.random() * (pegou + 1));

      document.querySelector('#estatistica').innerHTML = `
        <p><span>Viu</span><span>${viu}</span></p>
        <p><span>Pegou</span><span>${pegou}</span></p>
        <p><span>Enfrentou</span><span>${enfrentou}</span></p>
        <p><span>Usou</span><span>${usou}</span></p>
      `;
    }
    gerarEstatisticas();

    // Função para reproduzir o som do Pokémon
    const btSomPokemon = document.getElementById('btCirculoAmarelo');
    if (btSomPokemon) {
      btSomPokemon.onclick = () => {
        new Audio(`https://play.pokemonshowdown.com/audio/cries/${data.name.toLowerCase()}.mp3`).play();
      };
    }
  }).fail(function(jqXHR) {
    console.log("Erro HTTP: " + jqXHR.status);
  });
}

// Função para alternar entre Atributos e Descrição
function toggleAbas() {
  const btAtributos = document.querySelector('.btAtributos');
  const btDescricao = document.querySelector('.btDescricao');
  
  // Alterna entre Atributos e Descrição
  btAtributos.addEventListener('click', function() {
    document.querySelector('#importaDadosPokemon').style.display = 'flex';
    document.querySelector('#importaDescricaoPokemon').style.display = 'none';
    this.classList.add('active');
    btDescricao.classList.remove('active');
  });

  btDescricao.addEventListener('click', function() {
    document.querySelector('#importaDescricaoPokemon').style.display = 'flex';
    document.querySelector('#importaDadosPokemon').style.display = 'none';
    this.classList.add('active');
    btAtributos.classList.remove('active');
  });

  // Inicia com Descrição visível
  document.querySelector('#importaDescricaoPokemon').style.display = 'flex';
  document.querySelector('#importaDadosPokemon').style.display = 'none';

  // Alterna entre as seções de Atributos e Descrição com as setas
  document.getElementById('dirLeft').addEventListener('click', function() {
    if (btAtributos.classList.contains('active')) {
      btDescricao.click();  // Clica em Descrição
    } else {
      btAtributos.click();  // Clica em Atributos
    }
  });

  document.getElementById('dirRight').addEventListener('click', function() {
    if (btDescricao.classList.contains('active')) {
      btAtributos.click();  // Clica em Atributos
    } else {
      btDescricao.click();  // Clica em Descrição
    }
  });

  // Lógica para dirUP e dirDown
  document.getElementById('dirUP').addEventListener('click', function() {
    const pesquisaPokemon = document.getElementById('pesquisaPokemon').value;
    currentId = parseInt(pesquisaPokemon) || 1;  // Atualiza o ID com base no valor do campo de pesquisa
    currentId++;  // Incrementa o ID atual
    document.getElementById('pesquisaPokemon').value = currentId;  // Atualiza o campo de pesquisa
    getPokemon(currentId);  // Chama a função para buscar o Pokémon
  });

  document.getElementById('dirDown').addEventListener('click', function() {
    const pesquisaPokemon = document.getElementById('pesquisaPokemon').value;
    currentId = parseInt(pesquisaPokemon) || 1;  // Atualiza o ID com base no valor do campo de pesquisa
    if (currentId > 1) {  // Impede decremento abaixo de 1
      currentId--;  // Decrementa o ID atual
      document.getElementById('pesquisaPokemon').value = currentId;  // Atualiza o campo de pesquisa
      getPokemon(currentId);  // Chama a função para buscar o Pokémon
    }
  });
}

// Inicia o código
toggleAbas();


/* ***** */
// Adiciona o evento de 'keydown' para detectar quando a tecla Enter é pressionada
document.addEventListener('keydown', function(event) {
  // Verifica se a tecla pressionada é o Enter
  if (event.key === 'Enter') {
    // Simula o clique no botão de pesquisa (com a lupa)
    document.querySelector('#botao').click();
  }
});

// Adicionando o evento de clique no novo botão para acionar a pesquisa
document.querySelector('#btEnviar').addEventListener('click', function() {
  // Obtém o valor do campo de pesquisa
  const pesquisaValor = document.querySelector('#pesquisaPokemon').value;

  // Chama a função getPokemon passando o valor da pesquisa
  getPokemon(pesquisaValor);
});

// Adiciona o evento de 'keydown' para detectar quando a tecla Enter for pressionada
document.querySelector('#pesquisaPokemon').addEventListener('keydown', function(event) {
  // Verifica se a tecla pressionada foi a tecla Enter (código 13)
  if (event.key === 'Enter') {
    // Previne o comportamento padrão (caso haja algum)
    event.preventDefault();

    // Chama a função getPokemon com o valor do campo de pesquisa
    getPokemon($('#pesquisaPokemon').val());
  }
});
// Adiciona o evento de 'keydown' para detectar quando a tecla Escape for pressionada
document.addEventListener('keydown', function(event) {
  // Verifica se a tecla pressionada foi a tecla Escape (código 27)
  if (event.key === 'Escape') {
    // Previne o comportamento padrão (se necessário)
    event.preventDefault();

    // Simula o clique no botão .btNovo
    document.querySelector('.btNovo').click();
  }
});
// Adiciona o evento de 'keydown' para detectar quando as teclas de seta são pressionadas
document.addEventListener('keydown', function(event) {
  // Verifica se a tecla pressionada é uma das teclas de seta
  switch (event.key) {
    case 'ArrowUp':
      // Simula o clique no botão dirUP
      document.querySelector('.dirUp').click();
      break;
    case 'ArrowLeft':
      // Simula o clique no botão dirLeft
      document.querySelector('.dirLeft').click();
      break;
    case 'ArrowDown':
      // Simula o clique no botão dirDown
      document.querySelector('.dirDown').click();
      break;
    case 'ArrowRight':
      // Simula o clique no botão dirRight
      document.querySelector('.dirRight').click();
      break;
    default:
      break;
  }
});


// Função para digitar números no campo de pesquisa
function setupTeclado() {
  // Seleciona o campo de pesquisa
  const campoPesquisa = document.getElementById('pesquisaPokemon');

  // Adiciona um ouvinte de evento para cada tecla
  document.querySelectorAll('.tecla').forEach(tecla => {
    tecla.addEventListener('click', function() {
      const valorTecla = this.querySelector('div:first-child').textContent;
      campoPesquisa.value += valorTecla; // Adiciona o número ao campo de pesquisa
    });
  });

  // Adiciona um ouvinte de evento para o botão de apagar
  const btApagar = document.querySelector('.btApagar');
  btApagar.addEventListener('click', function() {
    campoPesquisa.value = campoPesquisa.value.slice(0, -1); // Remove o último caractere do campo de pesquisa
  });
}

// Chama a função para configurar o teclado
setupTeclado();




// Função para limpar as variáveis e resetar os elementos
function resetarCampos() {
  // Limpa as variáveis de estatísticas
  let viu = "-";
  let pegou = "-";
  let enfrentou = "-";
  let usou = "-";

  // Atualiza os elementos de estatísticas com "-"
  document.querySelector('#estatistica').innerHTML = `
    <p><span>Viu</span><span>${viu}</span></p>
    <p><span>Pegou</span><span>${pegou}</span></p>
    <p><span>Enfrentou</span><span>${enfrentou}</span></p>
    <p><span>Usou</span><span>${usou}</span></p>
  `;

  // Limpa as fraquezas e resistências (valores vazios)
  let fraquezas = [];
  let resistencias = [];

  // Exibe fraquezas com <span> para cada uma, mas vazio se não houver
  let content = '<p><span class="fraqueza">Fraquezas:</span><br>';
  fraquezas.forEach(weakness => {
    content += `<span>${weakness} </span>`;
  });
  content += '</p>';
  $("#importaFraquezaPokemon").html(content);

  // Exibe resistências com <span> para cada uma, mas vazio se não houver
  content = '<p><span class="resistencia">Resistências:</span><br>';
  resistencias.forEach(resistance => {
    content += `<span>${resistance} </span>`;
  });
  content += '</p>';
  $("#importaResistenciaPokemon").html(content);

  // Limpa a imagem Pokémon
  const importaImagemPokemon = $("#importaImagemPokemon");
  importaImagemPokemon.html(""); 

  // Limpa os dados do Pokémon
  const importaDadosPokemon = $("#importaDadosPokemon");
  importaDadosPokemon.html(""); 

  // Limpa a descrição do Pokémon
  const importaDescricaoPokemon = $("#importaDescricaoPokemon");
  importaDescricaoPokemon.html(""); 

  // Se você quiser também limpar a pesquisa de Pokémon
  document.getElementById('pesquisaPokemon').value = "";  // Limpa o campo de pesquisa
}

// Adicionando o evento de clique no botão .btNovo
document.querySelector('.btNovo').addEventListener('click', function() {
  resetarCampos();  // Chama a função para resetar os campos ao clicar no botão
});

/******* */

// Seleciona o botão e o elemento que contém a descrição
const botao = document.getElementById('btCirculoPreto');
const importaDescricaoPokemon = document.getElementById('importaDescricaoPokemon');

// Adiciona um evento de clique ao botão
botao.addEventListener('click', function() {
  // Obtém o conteúdo do elemento
  const conteudo = importaDescricaoPokemon.textContent.trim();

  // Se não houver conteúdo, lê a mensagem informando que não há Pokémon selecionado
  if (conteudo === "") {
    const mensagem = "Não há Pokémon selecionado";
    const utterance = new SpeechSynthesisUtterance(mensagem);
    utterance.lang = 'pt-BR';  // Definindo o idioma para português
    speechSynthesis.speak(utterance);
  } else {
    // Se houver conteúdo, lê a descrição do Pokémon
    const utterance = new SpeechSynthesisUtterance(conteudo);
    utterance.lang = 'pt-BR';  // Definindo o idioma para português
    speechSynthesis.speak(utterance);
  }
});

/**  */

// Adiciona o evento de 'keydown' para detectar as teclas numéricas 0-9
document.addEventListener('keydown', function(event) {
  // Verifica se a tecla pressionada é um número de 0 a 9
  if (event.key >= '0' && event.key <= '9') {
    const campoPesquisa = document.getElementById('pesquisaPokemon');
    campoPesquisa.value += event.key; // Adiciona o número pressionado ao campo de pesquisa
  }

  // Verifica se a tecla pressionada é "Enter"
  if (event.key === 'Enter') {
    document.querySelector('#botao').click(); // Simula o clique no botão de pesquisa (com a lupa)
  }

  // Verifica se a tecla pressionada é "Escape" para resetar os campos
  if (event.key === 'Escape') {
    document.querySelector('.btNovo').click(); // Simula o clique no botão de reset
  }

  // Verifica se a tecla pressionada é "Backspace" (apagar)
  if (event.key === 'Backspace') {
    const campoPesquisa = document.getElementById('pesquisaPokemon');
    campoPesquisa.value = campoPesquisa.value.slice(0, -1); // Remove o último caractere
  }
});
