import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { StorageKeys } from '@/constants';
import { colors } from '@/constants';
import {
  Guide1,
  Guide2,
  Guide3,
  Guide4,
  Guide5,
  Guide6,
  Guide7,
} from '@/assets/images';

// 화면 너비 얻기
const { width: screenWidth } = Dimensions.get('window');

// 이미지 배열
const tutorialImages = [
  Guide1,
  Guide2,
  Guide3,
  Guide4,
  Guide5,
  Guide6,
  Guide7,
];

// Navigation 타입 정의
type TutorialNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tutorial'>;

const Tutorial = () => {
  const navigation = useNavigation<TutorialNavigationProp>();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // AsyncStorage에서 튜토리얼 완료 여부 확인
    const checkTutorialStatus = async () => {
      try {
        const tutorialCompleted = await AsyncStorage.getItem(StorageKeys.TUTORIAL_COMPLETED);
        if (tutorialCompleted === 'true') {
          // 이미 완료했으면 Permission 화면으로 바로 이동
          navigation.replace('Permission');
        }
        // 완료되지 않았으면 현재 화면 (튜토리얼) 유지
      } catch (error) {
        console.error('Failed to check tutorial status:', error);
        // 에러 발생 시에도 일단 튜토리얼을 보여주거나, 다른 처리 가능
      }
    };

    checkTutorialStatus();
  }, [navigation]);

  // 튜토리얼 완료 처리 함수
  const completeTutorial = async () => {
    try {
      await AsyncStorage.setItem(StorageKeys.TUTORIAL_COMPLETED, 'true');
      navigation.replace('Permission'); // Permission 화면으로 이동
    } catch (error) {
      console.error('Failed to save tutorial status:', error);
      // 에러 발생 시 사용자에게 알림 등 처리 가능
    }
  };

  // 스크롤 이벤트 핸들러 (페이지 계산)
  const handleScroll = (event: any) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth,
    );
    setCurrentPage(pageIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16} // 스크롤 이벤트 빈도 조절
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {tutorialImages.map((imageSource, index) => (
          <Image
            key={index}
            source={imageSource}
            style={styles.tutorialImage}
            resizeMode="contain" // 이미지가 잘리지 않도록
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {tutorialImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentPage === index && styles.paginationDotActive, // 활성 점 스타일
            ]}
          />
        ))}
      </View>

      {/* 마지막 페이지에서만 완료 버튼 표시 */}
      {currentPage === tutorialImages.length - 1 && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={completeTutorial}
        >
          <Text style={styles.completeButtonText}>오늘의 한끼 시작하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDA66F',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    // 각 이미지가 화면 너비를 차지하도록
  },
  tutorialImage: {
    width: screenWidth,
    height: '100%', // ScrollView 높이에 맞춤
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // 화면 하단 고정
    top: 80, // 버튼 위 간격
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.secondary,
    width: 10, // 활성 점 크기 키우기
    height: 10,
    borderRadius: 5,
  },
  completeButton: {
    position: 'absolute',
    bottom: 20, // 화면 하단 여백
    left: 20,
    right: 20,
    backgroundColor: colors.white,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Tutorial; 