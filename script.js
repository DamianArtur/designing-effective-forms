let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function setVatNumber(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const vatNumber = data[0].cca2; // Use the country's abbreviation
        const vatNumberForm = document.getElementById('vatNumber');
        vatNumberForm.value = vatNumber;
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            $('#country').val(country).trigger('change');
            getCountryCode(country);
            setVatNumber(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
        console.log(countryCode);
        const countryCodeForm = document.getElementById('countryCode');
        countryCodeForm.value = countryCode;
        // TODO inject countryCode to form
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}


(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);

    fetchAndFillCountries();
    getCountryByIP();

    $('#country').select2({
        placeholder: 'Wybierz kraj',
        allowClear: true
    });

    $('#country').on('select2:select', function (e) {
        var data = e.params.data;
        setVatNumber(data.id);
    });

    $(document).ready(function() {
        $('#firstName, #lastName, #street, #zipCode, #city').on('input', function() {
            var firstName = $('#firstName').val();
            var lastName = $('#lastName').val();
            var street = $('#street').val();
            var zipCode = $('#zipCode').val();
            var city = $('#city').val();
    
            $('#invoiceData').val(firstName + ' ' + lastName + ',\nul. ' + street + ',\n' + zipCode + ' ' + city);
        });
    });
})()
