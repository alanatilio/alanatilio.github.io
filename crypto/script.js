//SELECTORES
const form = document.querySelector("#form-search");
const moneda = document.querySelector("#moneda");
const criptomoneda = document.querySelector("#criptomonedas");
const formContainer = document.querySelector(".form-side");
const containerAnswer = document.querySelector(".container-answer");

const objBusqueda = { //objeto de las opciones
    moneda: '',
    criptomoneda: ''
}

//cada ves que se carga la pagina
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptos();
    form.addEventListener('submit', submitForm);
    moneda.addEventListener('change', getValue);
    criptomoneda.addEventListener('change', getValue);
})

//valida que los capos esten seleccionados, no podemos llamar a la API 
function submitForm(e){//Le llega como parameto un evento
    e.preventDefault();
    const {moneda, criptomoneda} = objBusqueda;
    if (moneda === '' || criptomoneda === '') {
        showError('Seleccione ambas monedas...');
        return;
    }
    consultarAPI(moneda, criptomoneda);
    //console.log(moneda);
    //console.log(criptomoneda);
}

//principal
function consultarAPI(moneda, criptomoneda){
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then(resultado => resultado.json())
        .then(resultadoJson => { //de la respuesta pasamos el atributo data con los 10 objetos
            mostrarCotizacion(resultadoJson.DISPLAY[criptomoneda][moneda]);
            //console.log(resultadoJson.DISPLAY[criptomoneda][moneda]);
        })
        .catch(error => console.log(error));
}

//escojemos lo que vamos a utilizar, estructuracion
function mostrarCotizacion(data){
    clearHTML();
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = data;
    const answer = document.createElement('div');
    answer.classList.add('display-info');
    answer.innerHTML = `
        <p class="main-price">Precio: <span>${PRICE}</span></p>
        <p>Precio más alto del día:: <span>${HIGHDAY}</span></p>
        <p>Precio más bajo del día: <span>${LOWDAY}</span></p>
        <p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>
        <p>Última Actualización: <span>${LASTUPDATE}</span></p>
    `;
    containerAnswer.appendChild(answer);//le pasamos lo que hemos seteado al selector para que ointe en la pantalla 
}
//si es que nos sale un error al consultar la api
function showError(mensage){
    const error = document.createElement('p');
    error.classList.add("error");
    error.textContent = mensage;
    formContainer.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}
//del objeto busqueda el atributo moneda setee al valor de la crypto
function getValue(e){
    objBusqueda[e.target.name] = e.target.value; 
}

//para la opcion de escojer que coin es la que vamos a escojer
function consultarCriptos(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(respuestaJson => {
            selectCriptos(respuestaJson.Data);
            //console.log(respuestaJson.Data);
        })
        .catch(error => console.log(error));
}


function selectCriptos(criptos){
    criptos.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;
        const option = document.createElement("option");//elemento de tipo obcion para setear
        option.value = Name; //le ponemos un valor
        option.textContent = FullName; //contenido que va a terner 
        criptomoneda.appendChild(option); //le pasamos los valores a las opciones de coins
    });
}
//limpia el html que se pinta en cada recarga
function clearHTML(){
    containerAnswer.innerHTML = '';
}