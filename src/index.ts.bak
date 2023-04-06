import { Sequelize } from "sequelize";
import config from "./configs/conf";
import chalk from "chalk";
import server from "./server";
import WASession from "./wa";

const sequelize: Sequelize = config.DATABASE;

if (process.env.APP_NAME) {
    sequelize
        .authenticate()
        .then(() => {
            if (process.env.HOST_LISTEN === undefined) {
                process.env.HOST_LISTEN = "8080";
            }
            server.listen(
                process.env.APP_PORT,
                parseInt(process.env.HOST_LISTEN),
                async function () {
                    await sequelize.sync();
                    await new WASession().init();
                    if (server.listening) {
                        console.log(
                            chalk.greenBright.bold(
                                `Server is listening on port ${process.env.APP_PORT}`
                            )
                        );
                    }
                }
            );
        })
        .catch((err) => {
            console.log(chalk.redBright.bold(err));
        });
} else {
    process.exit(1);
}
sequelize.authenticate;
