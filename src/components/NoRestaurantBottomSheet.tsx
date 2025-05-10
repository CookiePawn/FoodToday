import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants';

interface NoRestaurantBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onRetry: () => void;
}

const NoRestaurantBottomSheet = ({ visible, onClose, onRetry }: NoRestaurantBottomSheetProps) => {
  if (!visible) return null;

  return (
    <View style={styles.bottomSheet}>
      <View style={styles.bottomSheetContent}>
        <Text style={styles.bottomSheetTitle}>알림</Text>
        <Text style={styles.bottomSheetMessage}>
          주변에 음식점이 없습니다.{'\n'}
          다른 카테고리를 선택해주세요.
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
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  bottomSheetContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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