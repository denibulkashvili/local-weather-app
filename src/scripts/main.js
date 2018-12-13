/* global $ */
const WeatherURL = 'https://fcc-weather-api.glitch.me/api/current';
class Weather {
  constructor(response) {
    super.constructor();
    this.response = response;
  }

  get tempInCelsius() {
    return Math.round(this.response.main.temp);
  }

  static tempInFahrenheit(tempInCelsius) {
    return Math.round((tempInCelsius * 9) / 5 + 32);
  }

  get description() {
    return this.response.weather[0] ? this.response.weather[0].main : '';
  }

  get location() {
    return this.response.name;
  }

  get iconSource() {
    const iconID = this.response.weather[0] ? this.response.weather[0].id : 800;
    switch (true) {
      case iconID >= 200 && iconID <= 232:
        return '/images/thunderstorm.png';
      case (iconID >= 300 && iconID <= 321) || (iconID >= 500 && iconID <= 531):
        return '/images/rain.png';
      case iconID >= 600 && iconID <= 622:
        return '/images/snow.png';
      case iconID >= 701 && iconID <= 781:
        return '/images/fog.png';
      case iconID === 800:
        return '/images/sunny.png';
      case iconID >= 801 && iconID <= 804:
        return '/images/partly-cloudy.png';
      default:
        return '/images/sunny.png';
    }
  }

  static get celsiusSymbol() {
    return '°C';
  }

  static get fahrenheitSymbol() {
    return '°F';
  }
}


$.when($.ready).then(() => {
  const switchButtonID = '#switch-temp';
  const tempValueID = '#temp';
  const tempScaleID = '#temp-scale';
  const tempBoxID = '#temp-box';
  const locationID = '#location';
  const descriptionID = '#weather-type';
  const weatherIconID = '#weather-icon';
  const CELSIUS = 'celsius';
  const FAHRENHEIT = 'fahrenheit';

  const getWeatherData = (lat, lon) => { // eslint-disable-arrow-body-style
    return new Promise(((resolve, reject) => {
      $.ajax({
        url: WeatherURL,
        data: {
          lat,
          lon,
        },
        success: resolve,
        error: reject,
      });
    }));
  };

  const setIconImageSource = (src) => {
    $(weatherIconID).attr('src', src);
  };

  const displayTemperatureValues = (tempValue, tempSymbol) => {
    $(tempValueID).text(tempValue);
    $(tempScaleID).text(tempSymbol);
  };

  const displayTemperatureOnScreen = (dataToBeDisplayed) => {
    $(locationID).text(dataToBeDisplayed.location);
    $(descriptionID).text(dataToBeDisplayed.description);
    setIconImageSource(dataToBeDisplayed.iconSource);
    displayTemperatureValues(dataToBeDisplayed.tempInCelsius, Weather.celsiusSymbol);
  };

  const getCoordinates = () => { // eslint-disable-arrow-body-style
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({lat: position.coords.latitude, lon: position.coords.longitude});
      },
      (err) => {
        switch(err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error('You need to allow browser to get location access.'));
            break;
          case err.POSITION_UNAVAILABLE:
            reject(new Error('Your location information is unavailable.'));
            break;
          case err.TIMEOUT:
            reject(new Error('The request to get your location timed out.'));
            break;
          case error.UNKNOWN_ERROR:
            reject(new Error('An unknown error occurred.'));
            break;
          }
      });
    });
  };

  const buttonShouldNowSwitchTo = (type) => {
    if (type === FAHRENHEIT) {
      $(switchButtonID).data('scale', CELSIUS).text('Switch to Fahrenheit');
    } else {
      $(switchButtonID).data('scale', FAHRENHEIT).text('Switch to Celsius');
    }
  };

  const onSwitchButtonClicked = () => {
    const currentScale = $(switchButtonID).data('scale');
    const tempInCelsius = $(tempBoxID).data('valueInCelsius');
    if (currentScale === CELSIUS) {
      buttonShouldNowSwitchTo(CELSIUS);
      displayTemperatureValues(Weather.tempInFahrenheit(tempInCelsius), Weather.fahrenheitSymbol);
    } else {
      buttonShouldNowSwitchTo(FAHRENHEIT);
      displayTemperatureValues(tempInCelsius, Weather.celsiusSymbol);
    }
  };

  const displayErrorOnScreen = (err) => {
    $(locationID).text(err).css('color', 'red');
  };

  (function () {
    buttonShouldNowSwitchTo(FAHRENHEIT);
    $(switchButtonID).on('click', onSwitchButtonClicked);
    getCoordinates()
      .then(({ lat, lon }) => getWeatherData(lat, lon))
      .then((responseData) => {
        const weatherObj = new Weather(responseData);
        $(tempBoxID).data('valueInCelsius', weatherObj.tempInCelsius);
        displayTemperatureOnScreen(weatherObj);
      })
      .catch(err => displayErrorOnScreen(err));
  }());
});
