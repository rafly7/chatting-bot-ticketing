const data = {
    general: {
        NUMBER_SYNTAX_ERROR:
            "```Enter a valid contact number as per the syntax below:\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. YYXXXXXXXXXX (YY- Country Code, without zeros)```",
        MESSAGE_NOT_TAGGED: "```Tag a message or enter a number.```",
        NOT_A_GROUP: "```Command only applicable in a group chat.```",
        BOT_NOT_ADMIN:
            "```Sorry, don't have permission to do so since I am not an admin.```",
        ADMIN_PERMISSION:
            "```You need to be an admin to execute this command.```",
        SUDO_PERMISSION:
            "```Hey there, I am 💠BotsApp💠. I guess you were trying to use my commands in``` *{BotsApp.groupName}*```. However, the bot is currently in {worktype} mode. This enables only the owner and sudo users to use the command``` *{commandName}* ```.\n\nIf you are keen to use my features, you can deploy BotsApp on your own account without much effort, in less than 5 minutes! Check out the links given below.```\n\n🔗https://mybotsapp.com\n🔗https://github.com/Prince-Mendiratta/BotsApp",
        ERROR_TEMPLATE:
            "```Looks like something went wrong. Need not worry. Here are some logs since when the bot was not responding as expected.```\n```---------```\n```🧐 Command:``` *{commandName}*\n```😎 From Me?:``` *{fromMe}*\n```🗣️ Was a reply?:``` *{isReply}*\n```👥 In a group?``` *{isGroup}*\n```📥 In Inbox?``` *{isPm}*\n```📸 Command with image?``` *{isImage}*\n```🕺🏻 Is Bot group admin?``` *{isBotGroupAdmin}*\n```📈 Was Sender group admin?``` *{isSenderGroupAdmin}*\n```🫂 Was sender sudo?``` *{isSenderSudo}*\n```⚠️ Error:``` \n*{err}*\n```---------```\n_To figure out what exactly went wrong, please report/raise the issue on our support chat at_ https://chat.whatsapp.com/GRPWL8TBVq91lQig9JoqME",
        SUCCESSFUL_CONNECTION:
            "*BotsApp successfuly integrated.*\n```Bot is currently working in``` *{worktype}* ```mode.```\n```For more information regarding Bot working and permissions check out:``` \n🔗https://github.com/Prince-Mendiratta/BotsApp.\n\n⚠️ The bot will not work in this chat.",
    },
    help: {
        DESCRIPTION: "Get the command list and info on modules",
        EXTENDED_DESCRIPTION:
            "This module is used to get info on other modules and their triggers.",
        HEAD: "🌀 *BotsApp Menu* 🌀\n```Use .help command for detailed info on a module.```",
        TEMPLATE: "\n\n🤖 *Command* - ```{}```\n💡 *Info* - ```{}```",
        COMMAND_INTERFACE: "🌀 *BotsApp Command Interface* 🌀\n\n",
        COMMAND_INTERFACE_TEMPLATE: "💠 *Triggers -* ```{}```\n📚 *Info -* {}",
        FOOTER: "```\n\nClick on the button below to get a preview of the plugin.```",
    },
    song: {
        DESCRIPTION: "Download songs",
        EXTENDED_DESCRIPTION:
            "Use this module to download audio of your choice either by specifying a YouTube link or the name of the song.",
        ENTER_SONG: "```Enter song with the command```",
        SONG_NOT_FOUND:
            "```Could not find the song you entered. Check whether the link or keyword entered is correct.```",
        DOWNLOADING: "```Downloading your song...```",
        UPLOADING: "```Uploading song...```",
        INTRO: "",
    },
    tr: {
        DESCRIPTION: "Language Translator",
        EXTENDED_DESCRIPTION:
            "```Use```  *.tr <text> | <language>*  ```to translate text to the specified language. You can also reply to a text message with syntax```  *.tr <language>*  ```to translate text.\nIf you do not specify a language, it defaults to English```",
        PROCESSING: "```Translating. Please wait...```",
        TOO_LONG:
            "*Total characters should be less than 4000.*\n```Total characters for current input were``` ```{}.```",
        LANGUAGE_NOT_SUPPORTED: "```Language is invalid.```",
        INVALID_REPLY: "```Please reply to a text message.```",
        SUCCESS: "*TR:* Translate [*{}* -> *{}*]\n\n{}",
        NO_INPUT:
            "```No input was detected. Please use``` *.help tts* ```for info on how to use this module.```",
    },
    tagall: {
        DESCRIPTION: "Module to tag evryone in a group.",
        EXTENDED_DESCRIPTION:
            "```Use this module to tag everyone in the group by either replying to a message or simply using```  *.tagall*  ```command.```",
        TAG_MESSAGE: "",
    },
    weather: {
        DESCRIPTION: "Get weather data of a city",
        EXTENDED_DESCRIPTION:
            "```Obtain weather info by entering the city name.```",
        WEATHER_DATA:
            "*Temperature:* {tempInC} °C | {tempInF} °F\n*Min Temp:* {minTempInC} °C | {minTempInF} °F\n*Max Temp:* {maxTempInC} °C | {maxTempInF} °F\n*Humidity:* {humidity}%\n*Wind:* {windSpeedInkmph} kmph | {windSpeedInmph} mph , {degree}°\n*Sunrise:* {sunriseTime}\n*Sunset:* {sunsetTime}\n\n\n*{weatherDescription}*\n{cityName} , {country}\n{dateAndTime}",
        CITY_NAME_REQUIRED:
            "```Please mention the city name to search weather data.```",
        ERROR_OCCURED:
            "```Woops, cannot process this request. Try again later.```",
        DOWNLOADING: "```Processing data. Please wait...```",
        NOT_FOUND:
            "```City not found. Please recheck the spelling and adhere to syntax.```",
    },
    yt: {
        DESCRIPTION: "Get recommendations and links from Youtube",
        EXTENDED_DESCRIPTION:
            "```Get the first 10 recommendations from YouTube with their authorname, timestamp and link. Mention the keywords that are required to be searched along with the command.```",
        REPLY: "```Obtaining the recommendations...```",
        NO_VIDEOS: "```No videos could be found.```",
        ENTER_INPUT:
            "```Please enter the query you want to search for. Use the``` *.help yt* ```command for more info.```",
    },
};

export default data;
