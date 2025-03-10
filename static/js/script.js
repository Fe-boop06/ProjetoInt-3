// Lista de tipos de Pokémon
const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic',
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// Função para carregar os botões de tipos
function loadTypeButtons() {
    const typeButtonsContainer = document.getElementById('type-buttons');

    pokemonTypes.forEach(type => {
        const button = document.createElement('button');
        button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        button.classList.add('type-button', `type-${type}`);
        button.dataset.type = type;
        button.type = 'button'; // Impede que o botão envie o formulário

        // Adiciona um evento de clique para selecionar/deselecionar o tipo
        button.addEventListener('click', function () {
            const selectedButtons = document.querySelectorAll('.type-button.selected');

            // Permite selecionar no máximo dois tipos
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
            } else {
                if (selectedButtons.length < 2) {
                    this.classList.add('selected');
                } else {
                    alert('Você só pode selecionar até dois tipos.');
                }
            }
        });

        typeButtonsContainer.appendChild(button);
    });
}

// Função para carregar as imagens dos Pokémon
function loadPokemonImages() {
    const imageGrid = document.getElementById('image-grid');

    for (let i = 1; i <= 1025; i++) {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
        img.alt = `Pokémon ${i}`;
        img.dataset.number = i;

        img.addEventListener('click', function () {
            // Remove a classe 'selected' de todas as imagens
            document.querySelectorAll('.image-grid img').forEach(img => img.classList.remove('selected'));

            // Adiciona a classe 'selected' à imagem clicada
            this.classList.add('selected');

            // Preenche o número do Pokémon no formulário
            document.getElementById('number').value = this.dataset.number;
        });

        imageGrid.appendChild(img);
    }
}

// Função para adicionar Pokémon à Pokédex
document.getElementById('add-pokemon-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const number = document.getElementById('number').value;

    // Captura os tipos selecionados
    const selectedTypes = [];
    document.querySelectorAll('.type-button.selected').forEach(button => {
        selectedTypes.push(button.dataset.type);
    });

    if (selectedTypes.length === 0) {
        alert('Selecione pelo menos um tipo.');
        return;
    }
    if (!number) {
        alert('Selecione uma imagem antes de adicionar um Pokémon.');
        return;
    }

    // Cria o card do Pokémon
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const pokemonImage = document.createElement('img');
    pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`;
    pokemonImage.alt = name;

    const pokemonName = document.createElement('h2');
    pokemonName.textContent = name;

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonName);

    // Adiciona os tipos do Pokémon
    selectedTypes.forEach(type => {
        const typeElement = document.createElement('p');
        typeElement.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeElement.classList.add(`type-${type}`);
        pokemonCard.appendChild(typeElement);
    });

    // Adiciona evento de clique para abrir o modal
    pokemonCard.addEventListener('click', function () {
        console.log('Card clicado'); // Debug
        showPokemonDetail(this);
    });

    // Adiciona o card à Pokédex
    document.getElementById('pokedex').appendChild(pokemonCard);

    // Limpa o formulário e desmarca os botões
    document.getElementById('add-pokemon-form').reset();
    document.querySelectorAll('.type-button.selected').forEach(button => {
        button.classList.remove('selected');
    });
});

// Função para exibir detalhes do Pokémon e permitir edição do nome e exclusão
function showPokemonDetail(pokemonCard) {
    console.log('Exibindo detalhes do Pokémon'); // Debug
    const detailContainer = document.getElementById('pokemon-detail');
    const detailImage = document.getElementById('detail-image');
    const detailName = document.getElementById('detail-name');
    const detailTypes = document.getElementById('detail-types');
    const detailActions = document.getElementById('detail-actions');

    // Limpa o conteúdo anterior do modal
    detailActions.innerHTML = '';

    // Preenche os detalhes do Pokémon no modal
    detailImage.src = pokemonCard.querySelector('img').src;
    detailName.textContent = pokemonCard.querySelector('h2').textContent;

    // Limpa os tipos anteriores
    detailTypes.innerHTML = '';

    // Adiciona os tipos do Pokémon
    Array.from(pokemonCard.querySelectorAll('p')).forEach(typeElement => {
        const type = typeElement.textContent.toLowerCase();
        const typeButton = document.createElement('button');
        typeButton.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeButton.classList.add('type-button', `type-${type}`);
        detailTypes.appendChild(typeButton);
    });

    // Campo para editar nome
    const editNameInput = document.createElement('input');
    editNameInput.type = 'text';
    editNameInput.value = detailName.textContent;

    // Botão para salvar o novo nome
    const saveNameButton = document.createElement('button');
    saveNameButton.textContent = 'Salvar Nome';
    saveNameButton.classList.add('edit-button');
    saveNameButton.addEventListener('click', () => {
        const newName = editNameInput.value.trim();
        if (newName) {
            pokemonCard.querySelector('h2').textContent = newName;
            detailName.textContent = newName;
        } else {
            alert('O nome não pode estar vazio.');
        }
    });

    // Botão para excluir o Pokémon
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir Pokémon';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        pokemonCard.remove();
        detailContainer.style.display = 'none';
    });

    // Adiciona os elementos ao modal
    detailActions.appendChild(editNameInput);
    detailActions.appendChild(saveNameButton);
    detailActions.appendChild(deleteButton);

    // Exibe o modal
    detailContainer.style.display = 'block';
}

// Fecha o modal ao clicar no botão de fechar
document.querySelector('.close-detail').addEventListener('click', function () {
    document.getElementById('pokemon-detail').style.display = 'none';
});

// Carrega os botões de tipos e as imagens dos Pokémon quando a página é carregada
loadTypeButtons();
loadPokemonImages();