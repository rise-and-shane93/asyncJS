const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Make an AJAX request
// function getJSON(url) {
//   return new Promise( (resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', url);
//     xhr.onload = () => {
//       if(xhr.status === 200) {
//         let data = JSON.parse(xhr.responseText);
//         resolve(data);
//       } else {
//         reject( Error(xhr.statusText) );
//       }
//     };
//     xhr.onerror = () => reject( Error('Network error'));
//     xhr.send();
//   });
// }

function getProfiles(json) {
  const profiles = json.people.map( person => {
    const craft = person.craft;
    return fetch(wikiUrl + person.name)
      .then(response => response.json())
      .then( profile => {
        return {...profile, craft};
      })
      .catch( err => console.log(`Error fetching Wiki: ${err}`));
  });
  return Promise.all(profiles);
  //return console.log(Promise.all(profiles));
}

// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    section.innerHTML = `
      <img src=${person.thumbnail.source}>
      <span>${person.craft}</span>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;  
  });
}

btn.addEventListener('click', (e) => {
  e.target.textContent = 'loading...';
  fetch(astrosUrl)
    .then( response => response.json())
    .then(getProfiles)
    .then(generateHTML)
    .catch( err => {
      //peopleList.innerHTML = '<h3>Something went wrong</h3>';
      console.log(err)
    })
    .finally( () => e.target.remove());
});