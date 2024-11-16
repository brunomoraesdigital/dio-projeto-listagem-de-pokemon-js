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
                  <img alt="" src="${/*data.sprites.other.dream_world.front_default*/data.sprites.front_default}">
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

    // Descrição do Pokémon
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`,
      method: "get",
      dataType: "json"
    }).done(function(speciesData) {
      const descricao = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
      const descricaoLimpa = descricao ? descricao.flavor_text.replace(/[\x00-\x1F\x7F\x0C]/g, '').replace(/\.(?=\S)/g, '. ') : "Descrição não disponível";
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
  // Viu: valor aleatório entre 10 e 1000
  const viu = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

  // Pegou: valor aleatório entre 0 e o valor de "Viu"
  const pegou = Math.floor(Math.random() * (viu + 1));

  // Enfrentou: valor aleatório entre 0 e "Viu"
  const enfrentou = Math.floor(Math.random() * (viu + 1));

  // Usou: se "Pegou" for 0, "Usou" também será 0, caso contrário, entre 0 e "Pegou"
  const usou = pegou === 0 ? 0 : Math.floor(Math.random() * (pegou + 1));

  // Atualiza a HTML com as estatísticas
  document.querySelector('#estatistica').innerHTML = `
    <p><span>Viu</span><span>${viu}</span></p>
    <p><span>Pegou</span><span>${pegou}</span></p>
    <p><span>Enfrentou</span><span>${enfrentou}</span></p>
    <p><span>Usou</span><span>${usou}</span></p>
  `;
}

// Chama a função para gerar as estatísticas
gerarEstatisticas();
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


