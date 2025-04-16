import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Linking, Platform, Dimensions } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';
import * as RNLocalize from "react-native-localize";
import { useSetAtom } from 'jotai';
import { locationAtom } from '@/atoms/location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import Animated, {
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { NavigationIcon } from '@/assets';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const iconSize = 80;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CurrentPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface GeocodingResponse {
  countryName: string;
  principalSubdivision: string;
  city: string;
  locality: string;
  latitude: number;
  longitude: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

const Load = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('위치를 찾아보겠습니다');
  const setLocation = useSetAtom(locationAtom);
  const navigation = useNavigation<NavigationProp>();

  // 애니메이션 값
  const iconPosition = useSharedValue({ x: 0, y: screenHeight - 150 });
  const iconOpacity = useSharedValue(1);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: iconPosition.value.x,
      top: iconPosition.value.y,
      opacity: iconOpacity.value,
    };
  });

  const animateIcon = (found: boolean) => {
    'worklet';
    if (found) {
      // 위치를 찾았을 때의 애니메이션
      iconPosition.value = withSequence(
        withTiming(
          { x: screenWidth / 2 - iconSize / 2, y: screenHeight / 2 - iconSize / 2 },
          { duration: 500, easing: Easing.out(Easing.cubic) }
        ),
        withDelay(
          500,
          withTiming(
            { x: screenWidth + 100, y: -100 },
            { duration: 1000, easing: Easing.in(Easing.cubic) }
          )
        )
      );
      iconOpacity.value = withDelay(
        1500,
        withTiming(0, { duration: 500 })
      );
    } else {
      // 초기 애니메이션
      iconPosition.value = withTiming(
        { x: screenWidth / 2 - iconSize / 2, y: screenHeight / 2 - iconSize / 2 },
        { duration: 1000, easing: Easing.out(Easing.cubic) }
      );
    }
  };

  const getLocationInfo = (): Promise<GeocodingResponse> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async ({ coords }: CurrentPosition) => {
          const lat = coords.latitude;
          const lon = coords.longitude;
          const locale = RNLocalize.getLocales()[0].languageCode;

          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${locale}`,
            );
            const responseJson: GeocodingResponse = await response.json();
            resolve(responseJson);
          } catch (error) {
            console.error("주소 변환 오류:", error);
            reject(error);
          }
        },
        (error: GeolocationError) => {
          console.error("위치 정보 오류:", error);
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 2000,
          maximumAge: 3600000,
        },
      );
    });
  };

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      if (!permission) {
        Alert.alert('오류', '지원되지 않는 플랫폼입니다.');
        return false;
      }

      const result = await request(permission);

      if (result === 'granted') {
        return true;
      } else if (result === 'blocked') {
        Alert.alert(
          '위치 권한 필요',
          '위치 정보를 사용하려면 설정에서 권한을 허용해야 합니다.',
          [
            { text: '취소', style: 'cancel' },
            { text: '설정으로 이동', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        Alert.alert('위치 권한 필요', '위치 정보를 사용하려면 권한이 필요합니다.');
      }
      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError('위치 정보 접근 권한이 거부되었습니다.');
        return;
      }

      try {
        // 초기 아이콘 애니메이션 시작
        animateIcon(false);

        const locationInfo = await getLocationInfo();
        setLocation({
          latitude: locationInfo.latitude,
          longitude: locationInfo.longitude,
          country: locationInfo.countryName,
          province: locationInfo.principalSubdivision,
          city: locationInfo.city,
          district: locationInfo.locality,
        });

        // 위치 찾기 완료 애니메이션
        setMessage('위치를 찾았습니다!');
        animateIcon(true);

        // 애니메이션 완료 후 Find 페이지로 이동
        setTimeout(() => {
          navigation.navigate('Find');
        }, 2500);
      } catch (error: any) {
        setError(`위치 정보를 가져오는 데 실패했습니다: ${error.message}`);
      }
    };

    initializeLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <NavigationIcon width={iconSize} height={iconSize} fill="white" stroke="#0064FF" strokeWidth={2} />
      </Animated.View>

      <Text style={styles.message}>{message}</Text>
      {error && <Text style={styles.errorText}>오류: {error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
  },
  message: {
    color: '#0064FF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: screenHeight / 2 - 150,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Load; 