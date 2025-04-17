// CirclePulse.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, useWindowDimensions, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  runOnJS,
  withSpring,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { UserIcon, MapPinIcon, mapBackground } from '@/assets';
import { useAtomValue } from 'jotai';
import { locationAtom } from '@/atoms/location';
import { Typography } from '@/components';

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
const startRadius = 200;
const startOpacity = 1;
const maxRadius = screenWidth * 0.8;
const maxRadius2 = maxRadius * 1.3;
const firstCircleDuration = 1500;
const secondCircleDuration = 2100;

const iconSize = 40;
const iconBottom = 100;
const iconLeft = screenWidth / 2 - iconSize / 2;

// 마커 위치를 위한 타입 정의
interface MarkerPosition {
  x: number;
  y: number;
}

const CirclePulse = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const location = useAtomValue(locationAtom);
  const [markers, setMarkers] = useState<MarkerPosition[]>([]);
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  
  // 기울기 애니메이션을 위한 shared value
  const rotateX = useSharedValue(0);
  const locationOpacity = useSharedValue(1);
  const recommendOpacity = useSharedValue(0.3);
  
  const radius1 = useSharedValue(startRadius);
  const opacity1 = useSharedValue(startOpacity);
  const radius2 = useSharedValue(startRadius);
  const opacity2 = useSharedValue(0);

  const centerX = screenWidth / 2;
  const centerY = screenHeight - 100;

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
      color: locationOpacity.value === 1 ? '#0064FF' : '#666666',
    };
  });

  const recommendStyle = useAnimatedStyle(() => {
    return {
      opacity: recommendOpacity.value,
      color: recommendOpacity.value === 1 ? '#0064FF' : '#666666',
    };
  });

  useEffect(() => {
    setPlatform(Platform.OS as 'ios' | 'android');
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
    }, 1500);
  }, []);

  // 랜덤 마커 위치 생성
  useEffect(() => {
    const generateRandomMarkers = () => {
      const newMarkers: MarkerPosition[] = [];
      // Y 좌표 생성 범위: 화면 높이의 60% ~ 90% 사이 (지도 이미지 영역)
      const minY = screenHeight * 0.7;           
      const maxY = screenHeight * 1.4;  
      for (let i = 0; i < 3; i++) {
        newMarkers.push({
          x: Math.random() * (screenWidth - 80) + 40,           
          y: Math.random() * (maxY - minY) + minY,
        });               
      }      
      setMarkers(newMarkers);
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

  return (
    <View style={styles.container}>
      <View style={[styles.locationContainer, { top: screenHeight * SCREEN_RATIO.LOCATION_TOP }]}>
        <Animated.Text style={[styles.locationText, { fontSize: screenWidth * SCREEN_RATIO.FONT_SIZE.LOCATION }, locationStyle]}>
          {location ? `${location.city} ${location.district} 이시군요!` : '위치 정보 없음'}
        </Animated.Text>
        <Animated.Text style={[styles.recommendText, { fontSize: screenWidth * SCREEN_RATIO.FONT_SIZE.RECOMMEND }, recommendStyle]}>
          근처 음식점 중 랜덤으로 추천해드릴게요!
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

      {/* 마커를 transformContainer 밖에 배치하고 Y 좌표 조정 */}
      {markers.map((marker, index) => {
        // 3D 효과를 고려한 위치 계산
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
            <MapPinIcon width={30} height={30} fill="white" stroke="#0064FF" />     
          </View>
        );
      })}

      <View style={[styles.iconContainer, { left: iconLeft, bottom: iconBottom }]}>
        <UserIcon
          width={iconSize}
          height={iconSize}
          fill="white"
          stroke="#0064FF"
          strokeWidth={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  },
  recommendText: {
    marginTop: 8,
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
});

export default CirclePulse;