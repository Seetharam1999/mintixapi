import { Environment} from '.';
import { Config } from './config';

export class AppSetting {

    public static Env = Environment.development;

    public static getConfig() {
        return Config.getConfig();
    }
}
