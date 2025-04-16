export type RootStackParamList = {
  App: undefined;
  Load: undefined;
  Find: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 