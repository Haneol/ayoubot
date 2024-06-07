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
    return (
      message.author.id === client.user.id &&
      message.content.includes(`${year}년 ${month}월 ${date}일(`)
    );
  });

  if (!hasTodayMessage) {
    try {
      // OpenWeatherMap API 호출
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=${openWeatherApiKey}&lang=kr&units=metric`
      );
      const forecastData = response.data;

      logger.info(forecastData);

      // OpenWeatherMap API 호출 - 대기 오염
      const pollutionResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=37.5665&lon=126.9780&appid=${openWeatherApiKey}`
      );
      const pollutionData = pollutionResponse.data;

      logger.info(pollutionData);

      // 오늘의 예측 데이터 필터링
      const forecastWeather = forecastData.list.filter((forecast) =>
        forecast.dt_txt.startsWith(formattedDate)
      );

      // 오늘의 강수량 계산
      const precipitation = forecastWeather.reduce((total, forecast) => {
        return total + (forecast.rain ? forecast.rain["3h"] : 0);
      }, 0);

      // 오늘의 뉴스
      const newsResponse = await axios.get(
        "https://openapi.naver.com/v1/search/news.json?query=뉴스&display=5",
        {
          headers: {
            "X-Naver-Client-Id": newsID,
            "X-Naver-Client-Secret": newsSecret,
          },
        }
      );
      const newsList = newsResponse.data.items;

      logger.info(newsList);

      // 스팀 할인 품목
      const steamResponse = await axios.get(
        "https://store.steampowered.com/api/featuredcategories"
      );
      const steamList = steamResponse.data.specials.items;

      logger.info(steamList);

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
      const sortedSpecials = uniqueSteamList.sort((a, b) => {
        const discountA = 1 - a.final_price / a.original_price;
        const discountB = 1 - b.final_price / b.original_price;
        return discountB - discountA;
      });

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
    } catch (error) {
      logger.error("오늘 할 일 cron 생성 도중 오류가 발생했습니다:", error);
    }
  }
};
