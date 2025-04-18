import { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import RNExitApp from 'react-native-exit-app';

const useExitApp = () => {
    const backPressedTime = useRef(0);
    useEffect(() => {
        const backAction = () => {
          const currentTime = new Date().getTime();
          const timeDiff = currentTime - backPressedTime.current;
    
          if (timeDiff < 2000) { // 2초 이내에 다시 누른 경우
            RNExitApp.exitApp();
            return true;
          }
    
          backPressedTime.current = currentTime;
          ToastAndroid.show('한 번 더 누르면 앱이 종료됩니다', ToastAndroid.SHORT);
          return true;
        };
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
        return () => backHandler.remove();
      }, []);
};

export default useExitApp;
