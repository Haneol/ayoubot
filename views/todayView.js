const { EmbedBuilder } = require("discord.js");
const {
  getWeatherEmoji,
  getMinMaxTemp,
  getAirQualityGrade,
} = require("../utils/weatherUtil");
const { formatCurrency, getExchangeRate } = require("../utils/moneyUtil");

exports.sendTodayEmbededMsg = async (
  channel,
  today,
  forecastWeather,
  precipitation,
  pollutionData,
  newsList,
  sortedSpecials
) => {
  const minMaxTemp = getMinMaxTemp(forecastWeather);

  let newsMessage = "";
  newsList.forEach((news) => {
    newsMessage += `- [${news.title}](${news.link})\n`;
  });

  let steamMessage = "";
  sortedSpecials.slice(0, 7).forEach((game) => {
    const discount = Math.round(
      (1 - game.final_price / game.original_price) * 100
    );
    const originalPriceKRW = formatCurrency(game.original_price / 100);
    const finalPriceKRW = formatCurrency(game.final_price / 100);
    steamMessage += `- [**${
      game.name
    }**](${`https://store.steampowered.com/app/${game.id}}`}) ~~${originalPriceKRW}~~ → ${finalPriceKRW}(${discount}% 할인)\n`;
  });

  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(
      `${today.year}년 ${today.month}월 ${today.date}일(${today.dayOfWeek})`
    )
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .addFields(
      {
        name: `${forecastWeather[0].main.temp}° ${
          forecastWeather[0].weather[0].description
        } ${getWeatherEmoji(forecastWeather[0].weather[0].icon)}`,
        value: `
        최고: ${minMaxTemp[1]}° · 최저: ${minMaxTemp[0]}°
        습도 : ${forecastWeather[0].main.humidity}% · 풍속: ${
          forecastWeather[0].wind.speed
        }m/s
        강수량: ${precipitation}mm · 미세먼지 ${getAirQualityGrade(
          pollutionData.list[0].components.pm2_5,
          pollutionData.list[0].components.pm10
        )}
        `,
      },
      {
        name: "오늘의 뉴스",
        value: newsMessage,
      },
      {
        name: "스팀 할인",
        value: steamMessage,
      }
    )
    .setThumbnail(sortedSpecials[0].header_image);

  await channel.send({
    embeds: [embed],
  });
};
