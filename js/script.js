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

    // Adiciona a imagem do Pokémon com a classe para um ou dois tipos
    const typeClasses = data.types.map(({ type }) => type.name).join(" ");
    content += `
      <div class="imagemPokemon ${typeClasses}">
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
      <p>Número: ${data.id}</p>
      <p>Nome: ${data.name}</p>
      <p>Altura: ${alturaFormatada}</p>
      <p>Peso: ${pesoFormatado}</p>
      <p>Tipo: ${data.types.map(({ type }) => type.name).join(" / ")}</p>
    `;
    impoartaDadosPokemon.html(content);
  })
  .fail(function(jqXHR) {
    console.log("Erro HTTP: " + jqXHR.status);
  });
}
