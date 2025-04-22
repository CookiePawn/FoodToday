import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { colors } from '@/constants';
import { ArrowLeftIcon } from '@/assets';

type TermsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Terms'>;

const Terms = () => {
  const navigation = useNavigation<TermsScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon width={24} height={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>서비스 이용약관</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제 1 조 (목적)</Text>
          <Text style={styles.sectionContent}>
            이 약관은 오늘의 한끼 앱(이하 "앱")의 이용과 관련하여 필요한 사항을 규정함을 목적으로 합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제 2 조 (위치정보의 수집 및 이용)</Text>
          <Text style={styles.sectionContent}>
            1. 앱은 사용자의 위치 정보를 수집하여 주변 맛집 검색 서비스를 제공합니다.{'\n\n'}
            2. 위치 정보는 앱 사용 시에만 일시적으로 활용되며, 별도로 저장되거나 서버에 전송되지 않습니다.{'\n\n'}
            3. 사용자는 기기의 설정에서 언제든지 위치 정보 제공을 거부할 수 있으며, 이 경우 위치 기반 서비스는 이용할 수 없습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제 3 조 (광고)</Text>
          <Text style={styles.sectionContent}>
            1. 앱은 무료로 제공되며, 서비스 유지를 위해 광고가 포함될 수 있습니다.{'\n\n'}
            2. 광고는 제3자(Google AdMob 등)에 의해 제공될 수 있으며, 해당 광고 제공자의 개인정보 처리방침이 적용될 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제 4 조 (면책사항)</Text>
          <Text style={styles.sectionContent}>
            1. 앱에서 제공하는 정보는 참고 사항이며, 실제 매장 정보와 차이가 있을 수 있습니다.{'\n\n'}
            2. 개인 개발 프로젝트로 운영되는 본 앱의 특성상, 서비스는 예고 없이 변경되거나 중단될 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제 5 조 (문의사항)</Text>
          <Text style={styles.sectionContent}>
            서비스 이용 중 문의사항이 있으시면 앱 내 제공된 이메일 주소로 연락해 주시기 바랍니다.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>부칙</Text>
          <Text style={styles.sectionContent}>
            이 약관은 2025년 4월 18일부터 시행됩니다.
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

export default Terms; 