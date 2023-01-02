import { EnumDictionary } from '@/utils';

export interface ConfigsDict extends EnumDictionary<ConfigKey, string> {
}

export interface ConfigItem {
    key: string;
    value: string,
}

export enum ConfigKey {
    LimitDate = 'limit-date',
    AppVersion = 'app-version',
    EnableRanking = 'enable-ranking',
}
