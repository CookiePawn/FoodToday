// CirclePulse.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import MapPinIcon from '@/assets/icons/map-pin.svg';
import { UserIcon } from '@/assets';
import { useAtomValue } from 'jotai';
import { locationAtom } from '@/atoms/location';
import { Typography } from '@/components';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 애니메이션 값 정의
const startRadius = 200;
const startOpacity = 1;
const maxRadius = screenWidth * 0.8; // 화면 너비 기준
const maxRadius2 = maxRadius * 1.3;
const firstCircleDuration = 1500;
const secondCircleDuration = 2100;

const iconSize = 40;
// Icon 위치: 화면 하단 중앙 (하단에서 100 위)
const iconBottom = 100;
const iconLeft = screenWidth / 2 - iconSize / 2;

const CirclePulse = () => {
  const location = useAtomValue(locationAtom);
  const radius1 = useSharedValue(startRadius);
  const opacity1 = useSharedValue(startOpacity);
  const radius2 = useSharedValue(startRadius);
  const opacity2 = useSharedValue(0);

  // 원의 중심 좌표 (화면 좌표 기준)
  const centerX = screenWidth / 2;
  const centerY = screenHeight - 100;

  // 애니메이션 시퀀스를 반복하기 위한 상태 (예: 카운터 사용)
  const [animationCounter, setAnimationCounter] = React.useState(0);

  const resetAndRestartAnimation = () => {
    'worklet';
    // 상태 리셋 (opacity1 포함)
    radius1.value = startRadius;
    opacity1.value = startOpacity; // Reset opacity1
    radius2.value = startRadius;
    opacity2.value = 0;
    runOnJS(setAnimationCounter)(prev => prev + 1);
  };

  React.useEffect(() => {
    'worklet';

    // === 애니메이션 동시 시작 ===

    // 1번 원: startRadius -> maxRadius 확장
    radius1.value = withTiming(
      maxRadius,
      { duration: firstCircleDuration }
    );

    // 2번 원: startRadius -> maxRadius2 확장
    radius2.value = withTiming(
      maxRadius2,
      { duration: secondCircleDuration }
    );

    // 2번 원: 0.8 -> 0 페이드 아웃
    // 초기 opacity2 값은 0이므로, 먼저 0.8로 설정 필요
    opacity2.value = 0.9; // 시작 시 투명도 0.8로 설정
    opacity2.value = withTiming( // 바로 0으로 가는 애니메이션 시작
      0,
      { duration: secondCircleDuration },
      (finishedOpacity2) => {
        if (finishedOpacity2) {
          // 이 애니메이션이 완료될 때 리셋 및 재시작
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
      <View style={styles.locationContainer}>
        <Typography style={styles.locationText} >
          {location ? `${location.city} ${location.district} 이시군요!` : '위치 정보 없음'}
        </Typography>
        <Typography style={styles.recommendText}>근처 음식점 중 랜덤으로 추천해드릴게요!</Typography>
      </View>

      <View style={styles.transformContainer}>
        <Svg
          height={screenHeight}
          width={screenWidth}
          viewBox={`0 0 ${screenWidth} ${screenHeight}`}
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
      </View>

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
    color: '#0064FF',
  },
  recommendText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
  map: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  iconContainer: {
    position: 'absolute',
  },
  transformContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: screenWidth,
    height: screenHeight,
    transform: [
      { perspective: 800 },
      { rotateX: '60deg' }, // 필요시 기울기 다시 설정
    ],
  },
});

export default CirclePulse;