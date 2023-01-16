import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('#search-box');
let countryList = document.querySelector('.country-list');
let countryInfo = document.querySelector('.country-info');

function onInput(event) {
  let searchedQuery = event.target.value.trim();
  if (!searchedQuery) {
    clearInfo();
    clearList();
    return;
  }

  fetchCountries(searchedQuery)
    .then(countries => {
      if (countries.length > 10) {
        console.log(countries);
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
        clearInfo();
        clearList();
      } else if (countries.length > 2 && countries.length < 10) {
        console.log(countries);
        renderCountryList(countries);
        clearInfo();
      } else if (countries.length === 1) {
        renderCountryInfo(countries);
        clearList();
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name!')
    );
}

function renderCountryInfo(country) {
  const markup = country
    .map(
      ({ name, flags, capital, population, languages }) =>
        `<img src=${
          flags.svg
        } class="js-flag" alt="flag width="30" height="30"></img>
      <h2 class="js-country">${name.official}</h2>
      <p class="js-capital"> Capital: ${capital}</p>
      <p class="js-population"> Population: ${population}</p>
      <p class="js-languages">Languages: ${Object.values(languages)}</p>
    `
    )
    .join('');
  console.log(markup);
  countryInfo.innerHTML = markup;
}

function renderCountryList(countries) {
  const markup = countries
    .map(
      ({ name, flags }) =>
        `<li class="js-country-item">
      <img src=${flags.svg} class="js-flag" alt="flag width="30" height="30"></img>
      <h2 class="js-country">${name.official}</h2></li>`
    )
    .join('');
  console.dir(countries);
  countryList.innerHTML = markup;
}

inputField.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function clearList() {
  countryList.innerHTML = '';
}
function clearInfo() {
  countryInfo.innerHTML = '';
}
