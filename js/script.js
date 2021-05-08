let dropDown = document.getElementById('dropdown')
let countriesAPI = 'https://corona.lmao.ninja/v3/covid-19/countries'
let countryList = null;
let noOfCases = document.getElementById('stats_cases')
let totalCases = document.getElementById('stats_totalCases')
let noOfReco = document.getElementById('stats_reco')
let totalReco = document.getElementById('stats_totalReco')
let noOfDeaths = document.getElementById('stats_deaths')
let totalDeaths = document.getElementById('stats_totalDeaths')
let area = document.querySelector('.area')

function getCountries() {
    fetch(countriesAPI)
        .then(res => res.json())
        .then(data => {
            data.forEach(e => {
                countryList += `<option value=${e.countryInfo.iso3}>${e.country}</option>`
            })
            dropDown.innerHTML = countryList
        })
}
getCountries()
// =======================================================

// get dropdown countreis value and get data about that selected country
dropDown.onchange = (e) => {
    getCountryData(e.target.value)
}

// get data about country that is selected
let ctx = document.getElementById('myChart').getContext('2d')
function getCountryData(countryName) {
    fetch(`https://corona.lmao.ninja/v3/covid-19/countries/${countryName}?strict=true`)
        .then(resp => resp.json())
        .then(countryData => {
            console.log(countryData)
            area.innerText = countryData.country
            noOfCases.innerText = countryData.todayCases;
            totalCases.innerText = `total: ${countryData.cases}`
            noOfReco.innerText = countryData.todayRecovered
            totalReco.innerText = `total: ${countryData.recovered}`
            noOfDeaths.innerText = countryData.todayDeaths
            totalDeaths.innerText = `total: ${countryData.deaths}`

            var popup = new mapboxgl.Popup({
                offset: 25
            }).setText(
                `Total cases:${countryData.cases}, Active:${countryData.active},Deaths:${countryData.deaths}`
            );

            var monument = [countryData.countryInfo.long, countryData.countryInfo.lat];
            console.log(monument);
            // create DOM element for the marker
            var el = document.createElement('div');
            el.id = 'marker';
            el.style.backgroundImage = `url(${countryData.countryInfo.flag})`

            // create the marker
            new mapboxgl.Marker(el)
                .setLngLat(monument)
                .setPopup(popup) // sets a popup on this marker
                .addTo(map);
        })
}

// get worldwide covid data
function getAllData() {
    fetch(`https://corona.lmao.ninja/v3/covid-19/all`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data);

            noOfCases.innerText = data.todayCases
            totalCases.innerText = `total: ${data.cases}`
            noOfReco.innerText = data.todayRecovered
            totalReco.innerText = `total: ${data.recovered}`
            noOfDeaths.innerText = data.todayDeaths
            totalDeaths.innerText = `total: ${data.deaths}`

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Cases', 'Deaths', 'Actives', 'Recovered'],
                    datasets: [{
                        label: 'Covid-19 Stats',
                        data: [data.cases, data.deaths, data.active, data.recovered],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false
                }
            })
        })
}
getAllData()

let connection = navigator.onLine;

if (!connection) {
    alert('Please check you internet connection')
}