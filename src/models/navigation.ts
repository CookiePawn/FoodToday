import { NaverSearchResult } from "./NaverSearch";

export type RootStackParamList = {
  Load: undefined;
  FindAndroid: undefined;
  FindIOS: undefined;
  Result: {
    restaurant: NaverSearchResult;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 