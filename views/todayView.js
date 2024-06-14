const { EmbedBuilder } = require("discord.js");
const {
  getWeatherEmoji,
  getMinMaxTemp,
  getAirQualityGrade,
} = require("../utils/weatherUtil");
const { formatCurrency } = require("../utils/moneyUtil");

exports.sendTodayEmbededMsg = async (
  channel,
  today,
  forecastWeather,
  precipitation,
  pollutionData,
  newsList,
  sortedSpecials
) => {
  let newsMessage = "";
  if (!newsList) {
    newsMessage = "뉴스 정보가 불러와지지 않았어요.";
  } else {
    newsList.forEach((news) => {
      let title = news.title
        .replace(/&quot;/g, '"')
        .replace(/\[/g, "<")
        .replace(/\]/g, ">")
        .replace(/<b>/g, "**")
        .replace(/<\/b>/g, "**");
      newsMessage += `- [${title}](${news.link})\n`;
    });
  }

  let steamMessage = "";
  if (sortedSpecials == null) {
    steamMessage = "스팀 할인 정보가 불러와지지 않았어요.";
  } else {
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
  }

  let weatherName = "";
  let weatherValue = "";
  if (
    forecastWeather == null ||
    precipitation == null ||
    !pollutionData == null
  ) {
    weatherName = "오늘의 날씨";
    weatherValue = "날씨 정보가 불러와지지 않았어요.";
  } else {
    const minMaxTemp = getMinMaxTemp(forecastWeather);

    weatherName = `${forecastWeather[0].main.temp}° ${
      forecastWeather[0].weather[0].description
    } ${getWeatherEmoji(forecastWeather[0].weather[0].icon)}`;
    weatherValue = `
        최고: ${minMaxTemp[1]}° · 최저: ${minMaxTemp[0]}°\n습도 : ${
      forecastWeather[0].main.humidity
    }% · 풍속: ${
      forecastWeather[0].wind.speed
    }m/s\n강수량: ${precipitation}mm · 미세먼지 ${getAirQualityGrade(
      pollutionData.list[0].components.pm2_5,
      pollutionData.list[0].components.pm10
    )}
        `;
  }

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
        name: weatherName,
        value: weatherValue,
      },
      {
        name: "오늘의 뉴스",
        value: newsMessage,
      },
      {
        name: "스팀 할인",
        value: steamMessage,
      }
    );

  if (sortedSpecials && sortedSpecials.length > 0) {
    embed.setImage(sortedSpecials[0].header_image);
  }

  await channel.send({
    embeds: [embed],
  });
};
