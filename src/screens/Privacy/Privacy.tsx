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
          <Text style={styles.sectionTitle}>제1조 (개인정보의 처리 목적)</Text>
          <Text style={styles.sectionContent}>
            FoodToday(이하 "개발자")는 사용자의 위치정보를 다음과 같은 목적으로만 사용하며, 서버에 저장하지 않습니다.{'\n\n'}
            1. 서비스 제공{'\n'}
            - 사용자의 현재 위치 기반 주변 음식점 검색을 위한 위치정보 처리{'\n\n'}
            2. 기타{'\n'}
            - 위치정보는 앱 내에서만 사용되며, 서버에 전송하거나 저장하지 않습니다.{'\n\n'}
            3. 향후 서비스 개선을 위한 통계{'\n'}
            - 추후 서비스 개선을 위해 익명화된 사용 데이터를 수집할 수 있습니다.{'\n'}
            - 이 경우 별도의 개인정보 처리방침 개정을 통해 사전에 공지할 예정입니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제2조 (개인정보의 처리 및 보유 기간)</Text>
          <Text style={styles.sectionContent}>
            개발자는 서버를 운영하지 않으므로 개인정보를 저장하지 않습니다.{'\n\n'}
            - 위치정보: 앱 사용 중에만 사용되며, 앱 종료 시 즉시 삭제됩니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제3조 (개인정보의 제3자 제공)</Text>
          <Text style={styles.sectionContent}>
            개발자는 서버를 운영하지 않으므로 개인정보를 제3자에게 제공하지 않습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제4조 (개인정보처리의 위탁)</Text>
          <Text style={styles.sectionContent}>
            개발자는 서버를 운영하지 않으므로 개인정보 처리업무를 위탁하지 않습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제5조 (정보주체의 권리·의무 및 그 행사방법)</Text>
          <Text style={styles.sectionContent}>
            개발자는 서버를 운영하지 않으므로 개인정보를 저장하지 않습니다. 따라서 개인정보 열람, 정정, 삭제, 처리정지 요구가 불필요합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제6조 (개인정보의 파기)</Text>
          <Text style={styles.sectionContent}>
            개발자는 서버를 운영하지 않으므로 개인정보를 저장하지 않습니다. 위치정보는 앱 종료 시 자동으로 삭제됩니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제7조 (개인정보의 안전성 확보 조치)</Text>
          <Text style={styles.sectionContent}>
            개발자는 서버를 운영하지 않으므로 개인정보를 저장하지 않습니다. 위치정보는 앱 내에서만 사용되며, 앱 종료 시 자동으로 삭제됩니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제8조 (개인정보 보호책임자)</Text>
          <Text style={styles.sectionContent}>
            개발자는 서버를 운영하지 않으므로 개인정보를 저장하지 않습니다. 다만, 서비스 이용과 관련하여 궁금한 사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.{'\n\n'}
            개발자{'\n'}
            성명: 안준철{'\n'}
            연락처: 010-8915-2856{'\n'}
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