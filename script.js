'use strict';

const countriesContainer = document.querySelector('.countries');

const form = document.querySelector('.form');
const input = document.querySelector('.input');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

// Render card
const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className} ">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${
        Object.entries(data.languages)[0][1]
      }</p>
      <p class="country__row"><span>💰</span>${
        Object.entries(data.currencies)[0][0]
      }</p>
    </div>
  </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const App = function () {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let country = input.value;

    const whereAmI = async function () {
      try {
        // Country data

        form.addEventListener(
          'submit',
          await function (e) {
            e.preventDefault();
            country = input.value;
          }
        );
        form.remove();

        const res = await fetch(
          `https://restcountries.com/v3.1/name/${country}`
        );
        if (!res.ok) throw new Error('Problem getting country');
        const data = await res.json();

        renderCountry(data[0]);

        // Neighbour country //
        if (!('borders' in data[0])) {
          throw new Error('No neighbour found!');
        }

        const neighbour = data[0].borders;

        neighbour.forEach(e =>
          fetch(`https://restcountries.com/v3.1/alpha/${e}`)
            .then(res => res.json())
            .then(data => {
              const [countryNei] = data;

              renderCountry(countryNei, 'neighbour');
            })
        );
      } catch (err) {
        console.error(err);
        renderError(`Something went wrong: ${err.message}`);
      }
    };
    whereAmI();
  });
};

// Run App
App();
