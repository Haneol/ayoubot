function getWeatherEmoji(iconCode) {
  const weatherEmojis = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅️",
    "02n": "⛅️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌦️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };

  return weatherEmojis[iconCode] || "❓";
}

function getMinMaxTemp(todayWeather) {
  const maxTemp = Math.max(
    ...todayWeather.map((forecast) => forecast.main.temp_max)
  );
  const minTemp = Math.min(
    ...todayWeather.map((forecast) => forecast.main.temp_min)
  );

  return [minTemp, maxTemp];
}

function getAirQualityGrade(pm2_5, pm10) {
  if (pm2_5 >= 76 || pm10 >= 151) {
    return "매우 나쁨";
  } else if (pm2_5 >= 36 || pm10 >= 81) {
    return "나쁨";
  } else if (pm2_5 >= 16 || pm10 >= 31) {
    return "보통";
  } else if (pm2_5 >= 0 || pm10 >= 0) {
    return "좋음";
  } else {
    return "매우 좋음";
  }
}

module.exports = {
  getWeatherEmoji,
  getMinMaxTemp,
  getAirQualityGrade,
};
