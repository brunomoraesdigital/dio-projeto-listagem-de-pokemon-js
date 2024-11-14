function getPokemon(valor) {
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${valor}`,
    method: "get",
    dataType: "json"
  })
  .done(function(data) {
    console.log(data);
    let content = "";

    const importaImagemPokemon = $("#importaImagemPokemon");
    const importaDadosPokemon = $("#importaDadosPokemon");
    const importaDescricaoPokemon = $("#importaDescricaoPokemon");
    const importaFraquezaPokemon = $("#importaFraquezaPokemon");
    const importaResistenciaPokemon = $("#importaResistenciaPokemon");

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

    // Adiciona a imagem do Pokémon
    content += ` 
      <div class="imagemPokemon">
        <img alt="" src="${data.sprites.other.dream_world.front_default}">
      </div>
    `;
    importaImagemPokemon.html(content);

    // Converte a altura para centímetros ou metros
    const alturaEmCm = data.height * 10;
    const alturaFormatada = alturaEmCm > 100 
      ? (alturaEmCm / 100).toFixed(2).replace(".", ",") + " m"  // Exibe em metros com vírgula
      : alturaEmCm + " cm";  // Exibe em centímetros

    // Converte o peso para gramas ou quilogramas
    const pesoEmKg = data.weight / 10;
    const pesoFormatado = pesoEmKg >= 1 
      ? pesoEmKg.toFixed(2).replace(".", ",") + " kg"  // Exibe em quilogramas com vírgula
      : (pesoEmKg * 1000).toFixed(0) + " g";  // Exibe em gramas

    // Adiciona o ID, nome, altura, peso e tipos do Pokémon
    content = `
      <p><span>Número</span><span>${data.id}</span></p>
      <p><span>Nome</span><span>${data.name}</span></p>
      <p><span>Altura</span><span>${alturaFormatada}</span></p>
      <p><span>Peso</span><span>${pesoFormatado}</span></p>
      <p><span>Tipo</span><span>${data.types.map(({ type }) => type.name).join(" / ")}</span></p>
    `;
    importaDadosPokemon.html(content);

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

    // Obter fraquezas e resistências
    $.ajax({
      url: `https://pokeapi.co/api/v2/type/${data.types[0].type.name}`,
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

      // Log para ver os valores
      console.log("Fraquezas:", Array.from(fraquezas).join(", "));
      console.log("Resistências:", Array.from(resistencias).join(", "));

      // Exibe fraquezas com <span> para cada uma
      content = '<p><span class="fraqueza">Fraquezas</span><br>';
      fraquezas.forEach(weakness => {
        content += `<span>${weakness} </span>`;
      });
      content += '</p>';
      importaFraquezaPokemon.html(content);

      // Exibe resistências com <span> para cada uma
      content = '<p><span class="resistencia">Resistências</span><br>';
      resistencias.forEach(resistance => {
        content += `<span>${resistance} </span>`;
      });
      content += '</p>';
      importaResistenciaPokemon.html(content);
    });

    // Adiciona a descrição do Pokémon
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`,
      method: "get",
      dataType: "json"
    }).done(function(speciesData) {
      const descricaoEmIngles = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");

      // Limpa a descrição de caracteres de controle e adiciona espaço após o ponto final
      const descricaoLimpa = descricaoEmIngles ? descricaoEmIngles.flavor_text.replace(/[\x00-\x1F\x7F\x0C]/g, '').replace(/\.(?=\S)/g, '. ') : "Descrição não disponível";
      console.log("Descrição:", descricaoLimpa);

      //importaDescricaoPokemon.html(descricaoLimpa);
      importaDescricaoPokemon.html(`<p>${descricaoLimpa}</p>`);
    });
  })
  .fail(function(jqXHR) {
    console.log("Erro HTTP: " + jqXHR.status);
  });
}

// Função para alternar a visibilidade entre atributos e descrição
document.querySelector('.btAtributos').addEventListener('click', function() {
  // Exibe os atributos e esconde a descrição
  document.querySelector('#importaDadosPokemon').style.display = 'flex';
  document.querySelector('#importaDescricaoPokemon').style.display = 'none';

  // Marca o botão "Atributos" como ativo
  this.classList.add('active');
  document.querySelector('.btDescricao').classList.remove('active');
});

document.querySelector('.btDescricao').addEventListener('click', function() {
  // Exibe a descrição e esconde os atributos
  document.querySelector('#importaDescricaoPokemon').style.display = 'flex';
  document.querySelector('#importaDadosPokemon').style.display = 'none';

  // Marca o botão "Descrição" como ativo
  this.classList.add('active');
  document.querySelector('.btAtributos').classList.remove('active');
});

// Exibe a descrição por padrão ao carregar
document.querySelector('#importaDescricaoPokemon').style.display = 'flex';
document.querySelector('#importaDadosPokemon').style.display = 'none';


$(document).ready(function () {
  $(".btAtributos, .btDescricao").hover(function () {
    $(".flutuante").fadeIn();
  }, function () {
    $(".flutuante").fadeOut();
  });
});
