const WeatherURL = 'https://fcc-weather-api.glitch.me/api/current';
class Weather {
  constructor(response) {
    super.constructor();
    this.response = response;
  }

  get tempInCelsius() {
    return this.response.main.temp;
  }

  get tempInFahrenheit() {
    return (this.tempInCelsius * 9) / 5 + 32;
  }

  get location() {
    return this.response.name;
  }

  get iconSource() {
    return '/cloudy.png';
  }

  get celsiusSymbol() {
    return '°C';
  }

  get fahrenheitSymbol() {
    return '°F';
  }
}
$.when( $.ready ).then(function() {
  getWeatherData  = (lat, lon) => {
    return new Promise(((resolve, reject) => {
      $.ajax({
        url: WeatherURL,
        data: {
          lat,
          lon
        },
        success: resolve,
        error: reject,
      });
    }));
  };

  switchTemperatureTo = (type) => {
    //if celsius change to celsius
    // if fahrenheit change
  };

  displayTemperatureOnScreen = (dataToBeDisplayed) => {
    //display location in location identifier
    //show celsius temperature and it's symbol by default
    //show icon on weather app
    $('#results').html( '<strong>' + JSON.stringify(dataToBeDisplayed) + '</strong>' )
  };

  getCoordinates = () => {
    //change it to get real data
    return new Promise((resolve,reject)=> {
      let successful = true;
      successful ? resolve({ lat: 28.4891452, lon: 77.0911675 }) : reject();
    })
  };

  (function onLoad() {
    getCoordinates()
      .then(({ lat, lon }) => getWeatherData(lat, lon))
      .then(responseData => {
        const weatherObj = new Weather(responseData);
        displayTemperatureOnScreen(weatherObj);
      })
      .catch(err => displayTemperatureOnScreen(err));
  })();
});

// example response
// {
//   'coord': {
//   'lon': 77.09,
//     'lat': 28.49
// },
//   'weather': [
//   {
//     'id': 711,
//     'main': 'Smoke',
//     'description': 'smoke',
//     'icon': 'https://cdn.glitch.com/6e8889e5-7a72-48f0-a061-863548450de5%2F50d.png?1499366021771'
//   }
// ],
//   'base': 'stations',
//   'main': {
//   'temp': 20.99,
//     'pressure': 1016,
//     'humidity': 49,
//     'temp_min': 20,
//     'temp_max': 22
// },
//   'visibility': 1200,
//   'wind': {
//   'speed': 2.07,
//     'deg': 178.504
// },
//   'clouds': {
//   'all': 20
// },
//   'dt': 1544072400,
//   'sys': {
//   'type': 1,
//     'id': 9165,
//     'message': 0.0035,
//     'country': 'IN',
//     'sunrise': 1544059818,
//     'sunset': 1544097293
// },
//   'id': 1257567,
//   'name': 'Samālkha',
//   'cod': 200
// }