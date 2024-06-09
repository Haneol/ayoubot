const axios = require("axios");
const logger = require("../utils/logger");
const todayView = require("../views/todayView");
const { openWeatherApiKey, newsID, newsSecret } = require("../config.json");
const { todayChannelId } = require("../channelId.json");

// 날씨
// 뉴스 헤드라인
// 오늘의 스팀게임 할인
exports.run = async (client) => {
  const todayChannel = client.channels.cache.get(todayChannelId);

  const today = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });
  const [year, month, date, dayOfWeek] = today
    .split(".")
    .map((part) => part.trim());
  // 오늘 날짜 구하기
  const formattedDate = `${year}-${month.padStart(2, "0")}-${date.padStart(
    2,
    "0"
  )}`;
  logger.info(formattedDate);

  // 오늘 날짜의 메시지가 이미 있는지 확인
  const messages = await todayChannel.messages.fetch({ limit: 10 });
  const hasTodayMessage = messages.some((message) => {
    if (message.author.id === client.user.id) {
      const embed = message.embeds[0];
      if (
        embed &&
        embed.title &&
        embed.title.includes(`${year}년 ${month}월 ${date}일(`)
      ) {
        return true;
      }
    }
    return false;
  });

  if (!hasTodayMessage) {
    let forecastWeather;
    let precipitation;
    let pollutionData;
    let newsList;
    let sortedSpecials;
    try {
      // OpenWeatherMap API 호출
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=${openWeatherApiKey}&lang=kr&units=metric`
      );
      const forecastData = response.data;

      // OpenWeatherMap API 호출 - 대기 오염
      const pollutionResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=37.5665&lon=126.9780&appid=${openWeatherApiKey}`
      );
      pollutionData = pollutionResponse.data;

      // 오늘의 예측 데이터 필터링
      forecastWeather = forecastData.list.filter((forecast) =>
        forecast.dt_txt.startsWith(formattedDate)
      );

      // 오늘의 강수량 계산
      precipitation = forecastWeather.reduce((total, forecast) => {
        return total + (forecast.rain ? forecast.rain["3h"] : 0);
      }, 0);

      logger.info(
        `weather: ${forecastWeather[0].weather[0].description}, rain: ${precipitation}, pollution: ${pollutionData.list[0].components.pm10}`
      );
    } catch (error) {
      logger.error("todayController(weather) error: ", error);
    }

    try {
      // 오늘의 뉴스
      const headlineResponse = await axios.get(
        "https://openapi.naver.com/v1/search/news.json?query=헤드라인&display=1&sort=sim",
        {
          headers: {
            "X-Naver-Client-Id": newsID,
            "X-Naver-Client-Secret": newsSecret,
          },
        }
      );
      const headlineNews = headlineResponse.data.items[0];

      // 일반 뉴스 가져오기
      const newsResponse = await axios.get(
        "https://openapi.naver.com/v1/search/news.json?query=뉴스&display=4",
        {
          headers: {
            "X-Naver-Client-Id": newsID,
            "X-Naver-Client-Secret": newsSecret,
          },
        }
      );
      newsList = newsResponse.data.items;

      // 헤드라인 뉴스를 첫 번째 요소로 추가
      newsList.unshift(headlineNews);

      logger.info(`headline: ${newsList[0].title}, news: ${newsList[1].title}`);
    } catch (error) {
      logger.error("todayController(news) error: ", error);
    }

    try {
      // 스팀 할인 품목
      const steamResponse = await axios.get(
        "https://store.steampowered.com/api/featuredcategories?cc=kr"
      );
      const steamList = steamResponse.data.specials.items;

      // 이름을 기준으로 중복 제거
      const uniqueSteamList = [];
      const gameNames = new Set();

      steamList.forEach((game) => {
        if (!gameNames.has(game.name)) {
          uniqueSteamList.push(game);
          gameNames.add(game.name);
        }
      });

      // 할인율 기준으로 정렬
      sortedSpecials = uniqueSteamList.sort((a, b) => {
        const discountA = 1 - a.final_price / a.original_price;
        const discountB = 1 - b.final_price / b.original_price;
        return discountB - discountA;
      });

      logger.info(`steam: ${sortedSpecials[0].name}`);
    } catch (error) {
      logger.error("todayController(steam) error: ", error);
    }

    await todayView.sendTodayEmbededMsg(
      todayChannel,
      {
        dayOfWeek: dayOfWeek.slice(0, 1),
        month: month,
        date: date,
        year: year,
      },
      forecastWeather,
      precipitation,
      pollutionData,
      newsList,
      sortedSpecials
    );
  }
};
