import { NaverSearchResult } from "./NaverSearch";

export type RootStackParamList = {
  Load: undefined;
  Home: undefined;
  FindAndroid: undefined;
  FindIOS: undefined;
  Result: {
    restaurant: NaverSearchResult;
  };
  Permission: undefined;
  License: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 