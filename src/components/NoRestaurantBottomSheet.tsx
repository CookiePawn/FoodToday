import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { colors } from '@/constants';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface NoRestaurantBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onRetry: () => void;
}

const NoRestaurantBottomSheet = ({ visible, onClose, onRetry }: NoRestaurantBottomSheetProps) => {
  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      opacity.value = 0;
      translateY.value = withTiming(300, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      display: opacity.value === 0 ? 'none' : 'flex',
    };
  });

  const handleOverlayPress = () => {
    onClose();
  };

  return (
    <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlayContent} />
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View style={[styles.bottomSheet, animatedStyle]}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>알림</Text>
          <Text style={styles.bottomSheetMessage}>
            주변에 음식점이 없습니다.{'\n'}
            다른 카테고리를 선택해주세요.{'\n\n'}
            <Text style={styles.bottomSheetSubMessage}>
              * 해외의 경우 검색이 되지 않을 수 있습니다.
            </Text>
          </Text>
          <TouchableOpacity 
            style={styles.bottomSheetButton}
            onPress={() => {
              onClose();
              onRetry();
            }}
          >
            <Text style={styles.bottomSheetButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetContent: {
    padding: 24,
    alignItems: 'center',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 16,
  },
  bottomSheetMessage: {
    fontSize: 16,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  bottomSheetSubMessage: {
    fontSize: 14,
    color: colors.gray500,
    fontStyle: 'italic',
  },
  bottomSheetButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NoRestaurantBottomSheet; 