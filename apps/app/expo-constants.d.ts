/// <reference path="./appConfigTypes.ts" />import { AppExtraConfig } from "./appConfigTypes";

// expo-constants.d.ts
declare module 'expo-constants' {
  interface ExpoConfig {
    extra: import('./appConfigTypes').AppExtraConfig; 
  }
  
  interface Constants {
    expoConfig: ExpoConfig;
  }
  
  const Constants: Constants;
  export default Constants;
}