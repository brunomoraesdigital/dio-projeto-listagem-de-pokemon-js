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
    const impoartaDadosPokemon = $("#impoartaDadosPokemon");

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
    impoartaDadosPokemon.html(content);
  })
  .fail(function(jqXHR) {
    console.log("Erro HTTP: " + jqXHR.status);
  });
}
