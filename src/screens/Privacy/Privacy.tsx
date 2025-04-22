import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { colors } from '@/constants';
import { ArrowLeftIcon } from '@/assets';

type PrivacyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Privacy'>;

const Privacy = () => {
  const navigation = useNavigation<PrivacyScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon width={24} height={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>개인정보 처리방침</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제1조 (수집하는 개인정보 항목)</Text>
          <Text style={styles.sectionContent}>
            FoodToday(이하 "개발자")는 사용자의 위치정보를 다음과 같은 목적으로만 사용하며, 서버에 저장하지 않습니다.{'\n\n'}
            1. 위치정보{'\n'}
              - 앱 사용 시 사용자의 현재 위치 정보{'\n'}
              - 위치 정보는 일시적으로만 사용되며 저장되지 않습니다{'\n\n'}
            2. 광고 관련 정보{'\n'}
              - Google AdMob을 통해 수집되는 광고 식별자 및 관련 정보{'\n'}
              - 자세한 내용은 Google AdMob의 개인정보처리방침을 참고해 주세요
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제2조 (개인정보의 수집 및 이용목적)</Text>
          <Text style={styles.sectionContent}>
            1. 위치정보{'\n'}
            - 사용자 주변의 맛집 정보 제공{'\n\n'}
            2. 광고 관련 정보{'\n'}
              - 맞춤형 광고 제공{'\n'}
              - 광고 성과 측정
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제3조 (개인정보의 보유 및 이용기간)</Text>
          <Text style={styles.sectionContent}>
            1. 위치정보: 앱 사용 중에만 일시적으로 이용되며, 별도로 저장하지 않습니다.{'\n\n'}
            2. 광고 관련 정보: Google AdMob의 정책에 따라 처리됩니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제4조 (이용자의 권리)</Text>
          <Text style={styles.sectionContent}>
            1. 위치정보 수집 거부{'\n'}
              - 기기의 설정에서 위치 정보 제공을 거부할 수 있습니다{'\n'}
              - 위치 정보 제공을 거부할 경우 일부 서비스 이용이 제한될 수 있습니다{'\n\n'}
            2. 광고 개인화 거부{'\n'}
              - 기기의 설정에서 광고 개인화를 거부할 수 있습니다{'\n'}
              - 이 경우 맞춤형 광고가 제공되지 않을 수 있습니다
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제5조 (개인정보보호 책임자)</Text>
          <Text style={styles.sectionContent}>
            이름: 안준철{'\n'}
            이메일: dev.jcahn@gmail.com
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>부칙</Text>
          <Text style={styles.sectionContent}>
            이 개인정보처리방침은 2025년 4월 18일부터 적용됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default Privacy; 