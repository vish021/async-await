const axios = require('axios');

const getExchangeRate = async (from, to) => {
    try {
        const res = await axios.get('http://data.fixer.io/api/latest?access_key=ad8d70fc1bc4e3195b24fe033a1c2b94');
        const euro = 1/res.data.rates[from];
        const rate = euro * res.data.rates[to];

        if(isNaN(rate)) {
            throw new Error();
        }

        return rate; 
    } catch (e) {
        throw new Error(`Error: unable to get exchange rate for ${from} and ${to}`);
    }      
};

const getCountries = async (code) => {
    try {
        const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${code}`);
        return res.data.map((country) => country.name);
    } catch (e) {
        throw new Error(`Error: Unable to get countries that use ${code}`);
    }
};

const convertCurrency = async (from, to, amount) => {
    const rate = await getExchangeRate(from, to);
    const convertedAmount = (amount * rate).toFixed(2);
    const countries = await getCountries(to);

    return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend in the following countries: ${countries.join(', ')}`;
};

convertCurrency('USD', 'CAD', 20).then((message) => {
    console.log(message);
}).catch((e) => {
    console.log(e.message);
});
