import { DevConfig, BaseConfig } from "./index";
class AppConfig {

    private config: BaseConfig;

    public setEnvironment(environment: string) {
        this.config = new DevConfig();
       
    }

    public getConfig(): BaseConfig {
        return this.config;
    }
};

const _config = new AppConfig();
export const Config = _config;
