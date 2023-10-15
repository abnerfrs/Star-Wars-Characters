let currentPageUrl = 'https://swapi.dev/api/people/'

window.onload = async () => {
    try {
        await loadCharacter(currentPageUrl);
    } catch (error) {
        alert(Error('Erro no loading'))
    }

    const nextButton = document.getElementById('next-btn')
    const backButton = document.getElementById('back-btn')

    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)
}

async function loadCharacter(url) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = '';

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement('div');
            card.style.backgroundImage = `
            url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
            card.className = 'cards'

            const characterNameBg = document.createElement('div')
            characterNameBg.className = 'character-name-bg';

            const characterName = document.createElement('span')
            characterName.className = 'character-name'
            characterName.innerText = `${character.name}`;

            characterNameBg.appendChild(characterName);
            card.appendChild(characterNameBg);

            card.onclick = () =>{
                const modal = document.getElementById('modal');
                modal.style.visibility = 'visible'
                
                const modalContent = document.getElementById('modal-content');
                modalContent.innerHTML = '';

                const characterImg = document.createElement('div')
                characterImg.style.backgroundImage = `
                url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                characterImg.className = 'character-image'

                const name = document.createElement('span')
                name.className = 'character-details';
                name.innerText = `Nome: ${character.name}`

                const height = document.createElement('span')
                height.className = 'character-details';
                height.innerText = `Altura: ${convertHeight(character.height)}`

                const gender = document.createElement('span')
                gender.className = 'character-details';
                gender.innerText = `Genero: ${genderTransform(character.gender)}`

                const birth_year = document.createElement('span')
                birth_year.className = 'character-details';
                birth_year.innerText = `Nascimento: ${birthday(character.birth_year)}`

                modalContent.appendChild(characterImg);
                modalContent.appendChild(name);
                modalContent.appendChild(height);
                modalContent.appendChild(gender);
                modalContent.appendChild(birth_year);                


            }

            mainContent.appendChild(card)
        })

        const nextButton = document.getElementById('next-btn')
        const backButton = document.getElementById('back-btn')

        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;

        backButton.style.visibility = responseJson.previous ? "visible" : "hidden";

        currentPageUrl = url

    } catch (error) {
        alert(Error('Erro no carregamento do conteúdo'))
    }


}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacter(responseJson.next)

    } catch (erro) {
        alert(Error('Erro ao carregar próxima pagina'))
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {

        const response = await fetch(currentPageUrl);
        const responseJson = await response.json()


        await loadCharacter(responseJson.previous)
    } catch (error) {
        alert(Error('Erro ao voltar página'))
    }
}


function hideModal(){
    const modal = document.getElementById('modal')
    modal.style.visibility = 'hidden';

}

function convertHeight(height){
    if (height == 'unknown'){
        return 'desconhecido'
    } 
    return (height / 100).toFixed(2)
}

function genderTransform(gender){
    const genero = {
        male: 'Masculino',
        female: 'Feminino',
        hermaphrodite: 'Hermafrodita',
        none: 'Nenhum'
    }

    return genero[gender.toLowerCase()] || gender;
}

function birthday(birth){
    const birthYear = {
        unknown: 'Desconhecido'
    }

   return birthYear[birth.toLowerCase()] || birth;
}

