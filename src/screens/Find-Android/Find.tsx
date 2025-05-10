// CirclePulse.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, useWindowDimensions, Text, TouchableOpacity, RefreshControl, ScrollView, Alert } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  runOnJS,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { UserIcon, MapPinIcon, mapBackground } from '@/assets';
import { useAtomValue } from 'jotai';
import { locationAtom } from '@/atoms';
import { colors } from '@/constants';
import { searchNearbyRestaurants } from '@/services';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, NaverSearchResult } from '@/models';
import NoRestaurantBottomSheet from '@/components/NoRestaurantBottomSheet';

const SCREEN_RATIO = {
  LOCATION_TOP: 0.1,
  FONT_SIZE: {
    LOCATION: 0.06,
    RECOMMEND: 0.05,
  },
  MAP: {
    PERSPECTIVE: 800,
    SCALE: 1.2,
    TOP_OFFSET: 0.2,
  },
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 애니메이션 값 정의
const startRadius = 100;
const startOpacity = 1;
const maxRadius = 200;
const maxRadius2 = maxRadius * 1.3;
const firstCircleDuration = 1500;
const secondCircleDuration = 1900;

const iconSize = 40;
const iconBottom = screenHeight * 0.40 - iconSize / 2;
const iconLeft = screenWidth / 2 - iconSize / 2;

// 마커 위치를 위한 타입 정의
interface MarkerPosition {
  x: number;
  y: number;
}

// 랜덤한 음식 카테고리 배열
const foodCategories = [
  '한식', '중식', '일식', '양식', '분식', '치킨', '피자', '햄버거',
  '돈까스', '회', '초밥', '라면', '국밥', '찌개', '찜', '탕',
  '샐러드', '샌드위치', '카페', '디저트', '베이커리'
];

const CirclePulse = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const location = useAtomValue(locationAtom);
  const [markers, setMarkers] = useState<MarkerPosition[]>([]);
  const [showMarkers, setShowMarkers] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showButton, setShowButton] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  // 기울기 애니메이션을 위한 shared value
  const rotateX = useSharedValue(0);
  const locationOpacity = useSharedValue(1);
  const recommendOpacity = useSharedValue(0.3);

  const radius1 = useSharedValue(startRadius);
  const opacity1 = useSharedValue(startOpacity);
  const radius2 = useSharedValue(startRadius);
  const opacity2 = useSharedValue(0);

  const centerX = screenWidth / 2;
  const centerY = screenHeight / 2 + 50;

  const [animationCounter, setAnimationCounter] = React.useState(0);

  const resetAndRestartAnimation = () => {
    'worklet';
    radius1.value = startRadius;
    opacity1.value = startOpacity;
    radius2.value = startRadius;
    opacity2.value = 0;
    runOnJS(setAnimationCounter)(prev => prev + 1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: SCREEN_RATIO.MAP.PERSPECTIVE },
        { rotateX: rotateX.value + 'deg' },
        { translateY: 100 },
      ],
    };
  });

  const locationStyle = useAnimatedStyle(() => {
    return {
      opacity: locationOpacity.value,
      color: locationOpacity.value === 1 ? colors.secondary : colors.gray600,
    };
  });

  const recommendStyle = useAnimatedStyle(() => {
    return {
      opacity: recommendOpacity.value,
      color: recommendOpacity.value === 1 ? colors.secondary : colors.gray600,
    };
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 기울기 애니메이션 시작
    rotateX.value = withTiming(60, {
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // 1.5초 후 텍스트 스타일 변경 애니메이션
    setTimeout(() => {
      locationOpacity.value = withTiming(0.3, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      recommendOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setShowMarkers(true);
    }, 2000);
  }, []);

  // 화면 처음 진입 시 랜덤 카테고리 선택
  useEffect(() => {
    const randomCategory = foodCategories[Math.floor(Math.random() * foodCategories.length)];
    setSelectedCategory(randomCategory);
  }, []);

  // 랜덤 마커 위치 생성
  useEffect(() => {
    const generateRandomMarkers = () => {
      const newMarkers: MarkerPosition[] = Array.from({ length: 5 }, () => ({
        x: Math.random() * (screenWidth - 50),
        y: Math.random() * (screenHeight * 0.9) + screenHeight * 0.8,                 
      }));
      setMarkers(newMarkers);     
               
      // 5초 후 버튼 표시
      setTimeout(() => {
        setShowButton(true);
      }, 3500);
    };

    generateRandomMarkers();
  }, []);

  React.useEffect(() => {
    'worklet';
    radius1.value = withTiming(
      maxRadius,
      { duration: firstCircleDuration }
    );

    radius2.value = withTiming(
      maxRadius2,
      { duration: secondCircleDuration }
    );

    opacity2.value = 0.9;
    opacity2.value = withTiming(
      0,
      { duration: secondCircleDuration },
      (finishedOpacity2) => {
        if (finishedOpacity2) {
          resetAndRestartAnimation();
        }
      }
    );
  }, [animationCounter]);

  const animatedProps1 = useAnimatedProps(() => {
    'worklet';
    return {
      r: radius1.value,
      opacity: opacity1.value,
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    'worklet';
    return {
      r: radius2.value,
      opacity: opacity2.value,
    };
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    try {
      // 랜덤 카테고리 선택
      const randomCategory = foodCategories[Math.floor(Math.random() * foodCategories.length)];
      setSelectedCategory(randomCategory);
    } catch (error) {
      console.error('카테고리 변경 중 오류:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleButtonPress = async () => {
    if (!location) return;
    
    try {
      // 선택된 카테고리로 검색
      const { items: restaurants } = await searchNearbyRestaurants(location, selectedCategory);
      console.log('검색된 음식점:', restaurants);
      
      if (!restaurants || restaurants.length === 0) {
        setShowBottomSheet(true);
        return;
      }

      const randomIndex = Math.floor(Math.random() * restaurants.length);
      const selectedRestaurant = restaurants[randomIndex];

      if (!selectedRestaurant || !selectedRestaurant.title) {
        console.log('선택된 음식점 정보가 유효하지 않습니다:', selectedRestaurant);
        return;
      }

      navigation.navigate('Result', { restaurant: selectedRestaurant });
    } catch (error) {
      console.error('음식점 검색 중 오류:', error);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={0}
        />
      }
    >
      <View style={styles.content}>
        <View style={[styles.locationContainer, { top: screenHeight * SCREEN_RATIO.LOCATION_TOP }]}>
          <Animated.Text style={[styles.locationText, { fontSize: screenWidth * SCREEN_RATIO.FONT_SIZE.LOCATION }, locationStyle]}>
            {location ? `${location.city} ${location.district} 이시군요!` : '위치 정보 없음'}
          </Animated.Text>
          <Animated.Text style={[styles.recommendText, { fontSize: screenWidth * SCREEN_RATIO.FONT_SIZE.RECOMMEND }, recommendStyle]}>
            {selectedCategory ? (
              <>
                <Text style={{ color: colors.gray500 }}>오늘은 </Text>
                <Text style={{ color: colors.secondary }}>{selectedCategory}</Text>
                <Text style={{ color: colors.gray500 }}>중에서 찾아드릴게요!</Text>
              </>
            ) : (
              '근처 음식점 중 랜덤으로 추천해드릴게요!'
            )}
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            styles.transformContainer,
            {
              width: screenWidth,
              height: screenHeight,
            },
            animatedStyle
          ]}
        >
          <Image
            source={mapBackground}
            style={[
              styles.backgroundImage,
              {
                width: screenWidth * SCREEN_RATIO.MAP.SCALE,
                height: screenHeight * SCREEN_RATIO.MAP.SCALE,
                top: -screenHeight * SCREEN_RATIO.MAP.TOP_OFFSET,
                left: -screenWidth * (SCREEN_RATIO.MAP.SCALE - 1) / 2,
              }
            ]}
            resizeMode="cover"
          />
          <Svg
            height={screenHeight}
            width={screenWidth}
            viewBox={`0 0 ${screenWidth} ${screenHeight}`}
            style={{ zIndex: 1 }}
          >
            <AnimatedCircle
              cx={centerX}
              cy={centerY}
              stroke="#c9c9c9"
              strokeWidth="2"
              fill="none"
              animatedProps={animatedProps1}
            />
            <AnimatedCircle
              cx={centerX}
              cy={centerY}
              stroke="#c9c9c9"
              strokeWidth="2"
              fill="none"
              animatedProps={animatedProps2}
            />
          </Svg>
        </Animated.View>

        {showMarkers && markers.map((marker, index) => {
          const adjustedY = marker.y * Math.cos(60 * Math.PI / 180);
          return (
            <View
              key={`${index}-${marker.x}-${marker.y}`}
              style={[
                styles.marker,
                {
                  left: marker.x,
                  top: adjustedY,
                },
              ]}
            >
              <MapPinIcon width={30} height={30} fill={colors.white} stroke={colors.secondary} />
            </View>
          );
        })}

        <View style={[styles.iconContainer, { left: iconLeft, bottom: iconBottom }]}>
          <UserIcon
            width={iconSize}
            height={iconSize}
            fill={colors.white}
            stroke={colors.secondary}
            strokeWidth={2}
          />
        </View>

        {showButton && (
          <TouchableOpacity 
            style={styles.button}
            onPress={handleButtonPress}
          >
            <Text style={styles.buttonText}>결과 보러가기</Text>
          </TouchableOpacity>
        )}
      </View>

      <NoRestaurantBottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        onRetry={onRefresh}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    height: screenHeight,
  },
  locationContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  locationText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
  },
  recommendText: {
    marginTop: 8,
    fontFamily: 'Pretendard-Regular',
  },
  transformContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  iconContainer: {
    position: 'absolute',
  },
  marker: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CirclePulse;