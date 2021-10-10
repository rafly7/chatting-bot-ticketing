const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const inputSanitization = require("../sidekick/input-sanitization");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
const https = require("https");
const config = require("../config");

const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(
    config.SERPAPI_API_KEY
);

const Strings = require("../lib/db");
const { dir } = require("console");
const WEATHER = Strings.weather;

module.exports = {
    name: "weather",
    description: WEATHER.DESCRIPTION,
    extendedDescription: WEATHER.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (args.length < 1) {
            client.sendMessage(
                BotsApp.chatId,
                WEATHER.CITY_NAME_REQUIRED,
                MessageType.text
            );
            return;
        } else if (
            args[args.length - 1] === "tom" ||
            args[args.length - 1] === "tomorrow"
        ) {
            var downloading = await client.sendMessage(
                BotsApp.chatId,
                WEATHER.DOWNLOADING,
                MessageType.text
            );
            args[args.length - 1] = "";
            var cityName = args.join(" ");
            const apiKey = config.FORECAST_WEATHER_API_KEY;
            const unit = "metric";

            const url =
                "https://api.openweathermap.org/data/2.5/forecast?q=" +
                cityName +
                "&appid=" +
                apiKey +
                "&units=" +
                unit +
                "&cnt=" +
                8;

            https.get(url, function (response) {
                console.log(response.statusCode);

                response.on("data", function (data) {
                    try {
                        const weatherData = JSON.parse(data);

                        const tempInC = Number(
                            weatherData.list[7].main.temp
                        ).toFixed(2);
                        const tempInF = (tempInC * 1.8 + 32).toFixed(2);
                        const minTempInC = Number(
                            weatherData.list[7].main.temp_min
                        ).toFixed(2);
                        const minTempInF = (minTempInC * 1.8 + 32).toFixed(2);
                        const maxTempInC = Number(
                            weatherData.list[7].main.temp_max
                        ).toFixed(2);
                        const maxTempInF = (maxTempInC * 1.8 + 32).toFixed(2);

                        const humidity = Number(
                            weatherData.list[7].main.humidity
                        ).toFixed(2);

                        const windSpeedInkmph = (
                            Number(weatherData.list[7].wind.speed) * 3.6
                        ).toFixed(2);
                        const windSpeedInmph = (
                            windSpeedInkmph * 0.621371
                        ).toFixed(2);
                        const windDegree =
                            weatherData.list[7].wind.deg.toFixed(2);

                        const sunriseTimeStamp = Number(
                            weatherData.city.sunrise
                        );
                        var sunriseDate = new Date(sunriseTimeStamp);
                        const sunriseTime =
                            sunriseDate.getHours() +
                            ":" +
                            sunriseDate.getMinutes() +
                            ":" +
                            sunriseDate.getSeconds();
                        const sunsetTimeStamp = Number(weatherData.city.sunset);
                        var sunsetDate = new Date(sunsetTimeStamp);
                        const sunsetTime =
                            sunsetDate.getHours() +
                            ":" +
                            sunsetDate.getMinutes() +
                            ":" +
                            sunsetDate.getSeconds();

                        var weatherDescription =
                            weatherData.list[7].weather[0].description;
                        weatherDescription = weatherDescription.toUpperCase();
                        cityName = weatherData.city.name;
                        const country = weatherData.city.country;
                        const timeOfRequest = weatherData.list[7].dt * 1000;
                        var date = new Date(timeOfRequest);

                        const dateAndTime =
                            date.getDate() +
                            "/" +
                            (date.getMonth() + 1) +
                            "/" +
                            date.getFullYear() +
                            " " +
                            date.getHours() +
                            ":" +
                            date.getMinutes() +
                            ":" +
                            date.getSeconds();

                        // Get image from remote url - Google search
                        const parameters = {
                            q: cityName + " " + weatherDescription,
                            tbm: "isch",
                            ijn: "0",
                            tbs: "qdr",
                        };
                        const imagePath =
                            "./tmp/image-" + chat.key.id + ".jpeg";
                        const callback = function (data) {
                            var imageUrl =
                                data["images_results"][0]["original"];
                            https.get(imageUrl, (res) => {
                                // Image will be stored at this path
                                const path = imagePath;
                                const filePath = fs.createWriteStream(path);
                                res.pipe(filePath);
                                filePath.on("finish", async () => {
                                    filePath.close();
                                    console.log("---\nDownload Completed\n---");
                                    await client.sendMessage(
                                        BotsApp.chatId,
                                        { url: imagePath },
                                        MessageType.image,
                                        {
                                            mimetype: Mimetype.jpeg,
                                            caption:
                                                WEATHER.WEATHER_DATA.format({
                                                    tempInC: tempInC,
                                                    tempInF: tempInF,
                                                    minTempInC: minTempInC,
                                                    minTempInF: minTempInF,
                                                    maxTempInC: maxTempInC,
                                                    maxTempInF,
                                                    maxTempInF,
                                                    humidity: humidity,
                                                    windSpeedInkmph:
                                                        windSpeedInkmph,
                                                    windSpeedInmph:
                                                        windSpeedInmph,
                                                    degree: windDegree,
                                                    sunriseTime: sunriseTime,
                                                    sunsetTime: sunsetTime,
                                                    weatherDescription:
                                                        weatherDescription,
                                                    cityName: cityName,
                                                    country: country,
                                                    dateAndTime: dateAndTime,
                                                }),
                                        }
                                    );
                                    inputSanitization.deleteFiles(imagePath);
                                    await client.deleteMessage(BotsApp.chatId, {
                                        id: downloading.key.id,
                                        remoteJid: BotsApp.chatId,
                                        fromMe: true,
                                    });
                                });
                            });
                        };
                        search.json(parameters, callback);
                    } catch (err) {
                        console.log(err);
                        client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                        client.sendMessage(
                            BotsApp.chatId,
                            WEATHER.ERROR_OCCURED,
                            MessageType.text
                        );
                        return;
                    }
                });
            });
            return;
        } else {
            var downloading = await client.sendMessage(
                BotsApp.chatId,
                WEATHER.DOWNLOADING,
                MessageType.text
            );
            var cityName = args.join(" ");
            const apiKey = config.CURRENT_WEATHER_API_KEY;
            const unit = "metric";

            const url =
                "https://api.openweathermap.org/data/2.5/weather?q=" +
                cityName +
                "&appid=" +
                apiKey +
                "&units=" +
                unit;

            https.get(url, function (response) {
                console.log(response.statusCode);
                response.on("data", function (data) {
                    try {
                        const weatherData = JSON.parse(data);
                        const tempInC = Number(weatherData.main.temp).toFixed(
                            2
                        );
                        const tempInF = (tempInC * 1.8 + 32).toFixed(2);
                        const minTempInC = Number(
                            weatherData.main.temp_min
                        ).toFixed(2);
                        const minTempInF = (minTempInC * 1.8 + 32).toFixed(2);
                        const maxTempInC = Number(
                            weatherData.main.temp_max
                        ).toFixed(2);
                        const maxTempInF = (maxTempInC * 1.8 + 32).toFixed(2);
                        const humidity = Number(
                            weatherData.main.humidity
                        ).toFixed(2);
                        const windSpeedInkmph = (
                            Number(weatherData.wind.speed) * 3.6
                        ).toFixed(2);
                        const windSpeedInmph = (
                            windSpeedInkmph * 0.621371
                        ).toFixed(2);
                        const windDegree = weatherData.wind.deg.toFixed(2);
                        const sunriseTimeStamp = Number(
                            weatherData.sys.sunrise
                        );
                        var sunriseDate = new Date(sunriseTimeStamp);
                        const sunriseTime =
                            sunriseDate.getHours() +
                            ":" +
                            sunriseDate.getMinutes() +
                            ":" +
                            sunriseDate.getSeconds();
                        const sunsetTimeStamp = Number(weatherData.sys.sunset);
                        var sunsetDate = new Date(sunsetTimeStamp);
                        const sunsetTime =
                            sunsetDate.getHours() +
                            ":" +
                            sunsetDate.getMinutes() +
                            ":" +
                            sunsetDate.getSeconds();
                        var weatherDescription =
                            weatherData.weather[0].description;
                        weatherDescription = weatherDescription.toUpperCase();
                        cityName = weatherData.name;
                        const country = weatherData.sys.country;
                        const timeOfRequest = weatherData.dt * 1000;
                        var date = new Date(timeOfRequest);

                        const dateAndTime =
                            date.getDate() +
                            "/" +
                            (date.getMonth() + 1) +
                            "/" +
                            date.getFullYear() +
                            " " +
                            date.getHours() +
                            ":" +
                            date.getMinutes() +
                            ":" +
                            date.getSeconds();

                        // Get image from remote url - Google search
                        const parameters = {
                            q: cityName + " " + weatherDescription,
                            tbm: "isch",
                            ijn: "0",
                            tbs: "qdr",
                        };
                        const imagePath =
                            "./tmp/image-" + chat.key.id + ".jpeg";
                        const callback = function (data) {
                            var imageUrl =
                                data["images_results"][0]["original"];
                            https.get(imageUrl, (res) => {
                                // Image will be stored at this path
                                const path = imagePath;
                                const filePath = fs.createWriteStream(path);
                                res.pipe(filePath);
                                filePath.on("finish", async () => {
                                    filePath.close();
                                    console.log("---\nDownload Completed\n---");
                                    await client.sendMessage(
                                        BotsApp.chatId,
                                        { url: imagePath },
                                        MessageType.image,
                                        {
                                            mimetype: Mimetype.jpeg,
                                            caption:
                                                WEATHER.WEATHER_DATA.format({
                                                    tempInC: tempInC,
                                                    tempInF: tempInF,
                                                    minTempInC: minTempInC,
                                                    minTempInF: minTempInF,
                                                    maxTempInC: maxTempInC,
                                                    maxTempInF,
                                                    maxTempInF,
                                                    humidity: humidity,
                                                    windSpeedInkmph:
                                                        windSpeedInkmph,
                                                    windSpeedInmph:
                                                        windSpeedInmph,
                                                    degree: windDegree,
                                                    sunriseTime: sunriseTime,
                                                    sunsetTime: sunsetTime,
                                                    weatherDescription:
                                                        weatherDescription,
                                                    cityName: cityName,
                                                    country: country,
                                                    dateAndTime: dateAndTime,
                                                }),
                                        }
                                    );
                                    inputSanitization.deleteFiles(imagePath);
                                    await client.deleteMessage(BotsApp.chatId, {
                                        id: downloading.key.id,
                                        remoteJid: BotsApp.chatId,
                                        fromMe: true,
                                    });
                                });
                            });
                        };
                        search.json(parameters, callback);
                    } catch (err) {
                        console.log(err);
                        client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                        client.sendMessage(
                            BotsApp.chatId,
                            WEATHER.ERROR_OCCURED,
                            MessageType.text
                        );

                        return;
                    }
                });
            });
            return;
        }
    },
};
