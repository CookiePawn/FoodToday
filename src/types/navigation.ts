export type RootStackParamList = {
  Load: undefined;
  FindAndroid: undefined;
  FindIOS: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 