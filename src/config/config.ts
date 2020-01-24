import { Environment, DevConfig, QaSConfig, BaseConfig, TestConfig } from "./index";
class AppConfig {

    private config: BaseConfig;

    public setEnvironment(environment: string) {
        switch (Environment[environment]) {
            case Environment.prod:
                this.config = new TestConfig();
                break;
            case Environment.development:
                this.config = new DevConfig();
                break;
            case Environment.qas:
                this.config = new QaSConfig();
                break;
            default:
              this.config = new DevConfig();
                //throw new Error('Invalid environment. Please set the environment first (E.g Set NODE_Env=local)');
        }
    }

    public getConfig(): BaseConfig {
        return this.config;
    }
};

const _config = new AppConfig();
export const Config = _config;
