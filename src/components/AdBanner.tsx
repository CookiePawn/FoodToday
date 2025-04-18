import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ANDROID_GOOGLE_AD_APP_ID, IOS_GOOGLE_AD_APP_ID } from '@env';

const adUnitId = __DEV__ 
  ? TestIds.BANNER 
  : Platform.OS === 'android' ? ANDROID_GOOGLE_AD_APP_ID : IOS_GOOGLE_AD_APP_ID;

const AdBanner = () => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
});

export default AdBanner; 