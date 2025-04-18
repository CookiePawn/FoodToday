import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { colors } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { MapPinIcon } from '@/assets';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import RNExitApp from 'react-native-exit-app';

const Permission = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const locationPermission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });

    if (!locationPermission) return;

    const result = await check(locationPermission);
    if (result === RESULTS.GRANTED) {
      navigation.navigate('Load');
      return;
    }
    setIsLoading(false);
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleRequestPermission = async () => {
    const locationPermission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });

    if (!locationPermission) return;

    const result = await request(locationPermission);
    if (result === RESULTS.GRANTED) {
      navigation.navigate('Load');
    } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
      handleOpenSettings();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}/>
    );
  }

  return (
    <View style={styles.container}>
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
          <Text style={[styles.buttonText, { color: colors.primary }]}>권한 허용하기</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => RNExitApp.exitApp()}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>나중에 하기</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('License')}
          style={styles.licenseLink}
        >
          <Text style={styles.licenseText}>오픈소스 라이선스</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
    color: colors.white,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.white,
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
    backgroundColor: colors.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.white,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  licenseLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  licenseText: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
});

export default Permission; 