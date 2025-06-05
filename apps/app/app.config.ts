import { ExpoConfig, ConfigContext } from 'expo/config';
import { AppExtraConfig } from './appConfigTypes';

export default ({ config }: ConfigContext): ExpoConfig => {
  const extraConfig: AppExtraConfig = {
    apiUrl: process.env.API_URL || 'https://api.flowbudget.com',
  };

  return {
    ...config,
    slug: config.slug ?? 'flow-budget',
    name: config.name ?? 'Flow Budget',
    extra: extraConfig
  };
};
