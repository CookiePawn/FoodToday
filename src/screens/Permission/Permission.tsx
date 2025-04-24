import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, StorageKeys } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { MapPinIcon } from '@/assets';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import RNExitApp from 'react-native-exit-app';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { AttendancePopup } from '@/components';

const Permission = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // 애니메이션 값
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    checkPermissionAndNavigate();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      opacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isLoading]);

  // YYYY-MM-DD 형식으로 날짜 반환
  const getISODate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // 출석 팝업 표시 여부 확인
  const shouldShowAttendancePopup = async (): Promise<boolean> => {
    const todayStr = getISODate(new Date());
    try {
      const lastVisitStr = await AsyncStorage.getItem(StorageKeys.ATTENDANCE_LAST_VISIT);
      // 오늘 방문 기록이 없으면 팝업 표시
      return lastVisitStr !== todayStr;
    } catch (error) {
      console.error('Failed to check last visit date:', error);
      return false; // 에러 시 팝업 표시 안 함
    }
  };

  // 권한 확인 및 네비게이션 로직
  const checkPermissionAndNavigate = async () => {
    const locationPermission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });

    if (!locationPermission) return;

    const result = await check(locationPermission);
    if (result === RESULTS.GRANTED) {
      const shouldShowPopup = await shouldShowAttendancePopup();
      if (shouldShowPopup) {
        setIsPopupVisible(true); // 출석 팝업 표시
      } else {
        navigation.navigate('Load'); // 바로 Load 페이지로 이동
      }
    } else {
      setIsLoading(false); // 권한 없으면 권한 요청 화면 표시
    }
  };

  // 권한 요청 로직
  const handleRequestPermission = async () => {
    const locationPermission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });

    if (!locationPermission) return;

    const result = await request(locationPermission);
    if (result === RESULTS.GRANTED) {
      // 권한 허용 후 다시 출석 체크 및 네비게이션
      const shouldShowPopup = await shouldShowAttendancePopup();
      if (shouldShowPopup) {
        setIsPopupVisible(true);
      } else {
        navigation.navigate('Load');
      }
    } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
      handleOpenSettings();
    }
  };

  // 설정 화면 열기
  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // 팝업 닫기 핸들러
  const handlePopupClose = () => {
    setIsPopupVisible(false);
    navigation.navigate('Load'); // 팝업 닫힌 후 Load 페이지로 이동
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AttendancePopup isVisible={isPopupVisible} onClose={handlePopupClose} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        <MapPinIcon width={80} height={80} fill={colors.primary} stroke={colors.white} strokeWidth={2} />
        <Text style={styles.title}>위치 권한이 필요합니다</Text>
        <Text style={styles.description}>
          음식점을 찾기 위해서는 위치 정보가 필요합니다.{'\n'}
          위치 권한을 허용해주시면 주변 음식점을{'\n'}
          더 정확하게 찾아드릴 수 있습니다.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleRequestPermission}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>권한 허용하기</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => RNExitApp.exitApp()}
          style={[styles.button, styles.secondaryButton]} 
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>나중에 하기</Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('License')}
            style={styles.link}
          >
            <Text style={styles.licenseText}>오픈소스 라이선스</Text>
          </TouchableOpacity>

          <Text style={styles.separator}>|</Text>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Terms')}
            style={styles.link}
          >
            <Text style={styles.licenseText}>서비스 이용약관</Text>
          </TouchableOpacity>

          <Text style={styles.separator}>|</Text>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Privacy')}
            style={styles.link}
          >
            <Text style={styles.licenseText}>개인정보 처리방침</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AttendancePopup isVisible={isPopupVisible} onClose={handlePopupClose} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray600,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    paddingHorizontal: 8,
  },
  separator: {
    color: colors.gray400,
    opacity: 0.7,
    fontSize: 14,
  },
  licenseText: {
    color: colors.gray400,
    fontSize: 14,
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
});

export default Permission; 