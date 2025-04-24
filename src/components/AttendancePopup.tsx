import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
// import { CheckIcon } from '@/assets'; // CheckIcon 임시 제거
import { colors, StorageKeys } from '@/constants';

// Dimensions API 사용하여 screenWidth 얻기
const { width: initialScreenWidth } = Dimensions.get('window');

interface AttendancePopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const AttendancePopup: React.FC<AttendancePopupProps> = ({ isVisible, onClose }) => {
  const { height: screenHeight } = useWindowDimensions();
  const [currentDate, setCurrentDate] = useState('');
  const [streak, setStreak] = useState(0);
  const [showContent, setShowContent] = useState(false); // 애니메이션 시작 제어

  // 애니메이션 초기값을 화면 위쪽으로 변경
  const translateY = useSharedValue(-screenHeight);
  const checkScale = useSharedValue(1); // 체크박스 스케일 애니메이션 값

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // 체크박스 애니메이션 스타일
  const checkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
    };
  });

  // 날짜 포맷팅 함수
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  };

  // YYYY-MM-DD 형식으로 날짜 반환
  const getISODate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // 팝업 닫기 애니메이션 (위로 올라가도록 수정)
  const handleClose = () => {
    translateY.value = withTiming(
      -screenHeight, // 화면 위로 이동
      {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setShowContent)(false); // 애니메이션 완료 후 컨텐츠 숨김
          runOnJS(onClose)(); // 실제 닫기 로직 실행
        }
      },
    );
  };

  // 출석 체크 로직
  const checkAttendance = async () => {
    const today = new Date();
    const todayStr = getISODate(today);
    setCurrentDate(formatDate(today));

    try {
      const lastVisitStr = await AsyncStorage.getItem(StorageKeys.ATTENDANCE_LAST_VISIT);
      const currentStreakStr = await AsyncStorage.getItem(StorageKeys.ATTENDANCE_STREAK);
      let currentStreak = currentStreakStr ? parseInt(currentStreakStr, 10) : 0;

      if (lastVisitStr === todayStr) {
        setStreak(currentStreak);
        console.log('Already checked in today.');
        runOnJS(handleClose)(); // 이미 출석했으면 바로 닫기
        return;
      }

      const lastVisitDate = lastVisitStr ? new Date(lastVisitStr) : null;
      let newStreak = 1;

      if (lastVisitDate) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = getISODate(yesterday);

        if (lastVisitStr === yesterdayStr) {
          newStreak = currentStreak + 1;
        } else {
          newStreak = 1;
        }
      }

      setStreak(newStreak);
      await AsyncStorage.setItem(StorageKeys.ATTENDANCE_LAST_VISIT, todayStr);
      await AsyncStorage.setItem(StorageKeys.ATTENDANCE_STREAK, newStreak.toString());
      console.log(`Attendance checked: ${newStreak} day streak.`);

      // 팝업 표시 애니메이션 시작
      setShowContent(true);
      translateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });

      // 체크박스 바운스 애니메이션 트리거
      checkScale.value = withSequence(
        withSpring(1.3, { damping: 3, stiffness: 150 }), // 커졌다가
        withSpring(1, { damping: 3, stiffness: 150 })    // 원래 크기로
      );

    } catch (error) {
      console.error('Failed to check attendance:', error);
      runOnJS(handleClose)(); // 에러 시 닫기
    }
  };

  // isVisible이 true가 될 때 출석 체크 실행
  useEffect(() => {
    if (isVisible) {
      // 팝업이 보일 때마다 스케일 초기화 (선택적)
      checkScale.value = 1;
      checkAttendance();
    } else {
      // isVisible이 false가 되면 애니메이션 없이 바로 숨김 (선택적)
      setShowContent(false);
      translateY.value = -screenHeight; // isVisible false 시 위치 초기화 (화면 위)
    }
  }, [isVisible]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none" // Modal 자체 애니메이션 끄기
      onRequestClose={handleClose} // 안드로이드 뒤로가기 버튼 처리
    >
      {/* Modal 컨테이너: 배경 및 정렬 담당 */}
      <View style={[styles.modalContainer, { height: screenHeight }]}>
        {/* 애니메이션 적용될 컨테이너 */}
        {/* showContent 상태 추가하여 불필요한 초기 렌더링 방지 가능 */}
        {showContent && (
          <Animated.View style={[styles.contentContainer, animatedStyle]}>
            {/* 실제 내용 */}
            <View style={styles.content}>
              <Text style={styles.dateText}>{currentDate}</Text>
              
              {streak === 1 ? (
                <Text style={styles.streakText}>출석 완료</Text>
              ) : (
                <Text style={styles.streakText}>
                  <Text style={styles.streakNumber}>{streak}일</Text> 연속 출석!
                </Text>
              )}

              {/* 단일 체크박스 렌더링 및 애니메이션 적용 */}
              <View style={styles.checkboxContainer}>
                <Animated.View style={[styles.checkbox, checkAnimatedStyle]}>
                  <View style={styles.checkMark} />
                </Animated.View>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleClose}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center', // 세로 중앙 정렬로 변경
  },
  contentContainer: {
    width: initialScreenWidth * 0.85, // Dimensions API 사용
    alignSelf: 'center', // 가로 중앙 정렬
  },
  content: { // 실제 내용 스타일
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  dateText: {
    fontSize: 16,
    color: colors.gray600, // colors.gray600 사용
    marginBottom: 8,
  },
  streakText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black, // colors.black 사용
    marginBottom: 30,
  },
  streakNumber: {
    color: colors.primary, // colors.primary 사용
    fontSize: 28,
  },
  checkboxContainer: {
    justifyContent: 'center', // 단일 아이템 중앙 정렬
    alignItems: 'center',
    height: 150,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 30,
    padding: 20,
  },
  checkbox: {
    width: 60,
    height: 60,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    width: 30, // 크기 증가
    height: 15, // 크기 증가
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.primary,
    transform: [{ rotate: '-45deg' }],
    marginBottom: 8,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary, // backgroundOrange 대신 primary 사용
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white, // colors.white 사용
  },
});

export default AttendancePopup; 