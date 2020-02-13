import { Config } from './config';

export class AppSetting {

    public static Env = process.env.Environment;

    public static getConfig() {
        return Config.getConfig();
    }
}
