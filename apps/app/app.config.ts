import { ConfigContext } from "expo/config";
import { AppExtraConfig } from "./appConfigTypes";

export default ({ config }: ConfigContext) => {
  console.log(process.env.EXPO_PUBLIC_API_URL);
  const extraConfig: AppExtraConfig = {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.flowbudget.com",
  };

  config.extra = extraConfig;
  return config;
};
