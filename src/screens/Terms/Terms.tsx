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
          <Text style={styles.sectionTitle}>제1조 (목적)</Text>
          <Text style={styles.sectionContent}>
            이 약관은 FoodToday(이하 "개발자")가 제공하는 위치 기반 음식점 검색 서비스의 이용과 관련하여 개발자와 이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제2조 (정의)</Text>
          <Text style={styles.sectionContent}>
            1. "서비스"라 함은 개발자가 제공하는 위치 기반 음식점 검색 애플리케이션을 의미합니다.{'\n\n'}
            2. "이용자"라 함은 서비스에 접속하여 이 약관에 따라 개발자가 제공하는 서비스를 이용하는 사용자를 말합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제3조 (서비스의 제공)</Text>
          <Text style={styles.sectionContent}>
            1. 개발자는 다음과 같은 서비스를 제공합니다:{'\n'}
            - 사용자의 현재 위치 기반 주변 음식점 검색{'\n'}
            - 음식점 기본 정보 제공{'\n\n'}
            2. 개발자는 서비스의 품질 향상을 위해 필요한 경우 서비스의 일부를 수정, 변경, 중단할 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제4조 (이용자의 의무)</Text>
          <Text style={styles.sectionContent}>
            1. 이용자는 다음 행위를 하여서는 안 됩니다:{'\n'}
            - 서비스의 운영을 고의로 방해하는 행위{'\n'}
            - 허위 정보를 게시하는 행위{'\n\n'}
            2. 이용자는 관계법령, 이 약관의 규정, 이용안내 등을 준수하여야 합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제5조 (서비스 이용의 제한 및 중지)</Text>
          <Text style={styles.sectionContent}>
            1. 개발자는 다음 각 호에 해당하는 경우 서비스 이용을 제한하거나 중지할 수 있습니다:{'\n'}
            - 이용자가 이 약관의 의무를 위반한 경우{'\n'}
            - 서비스의 안정적인 운영을 방해하는 경우{'\n\n'}
            2. 개발자는 서비스 이용의 제한 또는 중지에 대해 사전 통지할 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제6조 (책임의 한계)</Text>
          <Text style={styles.sectionContent}>
            1. 개발자는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.{'\n\n'}
            2. 개발자는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제7조 (기타)</Text>
          <Text style={styles.sectionContent}>
            1. 이 약관에 명시되지 않은 사항은 관련법령의 규정에 따릅니다.{'\n\n'}
            2. 이 약관의 해석에 관하여는 개발자와 이용자 간에 합의하여 결정하며, 합의가 이루어지지 않는 경우 대한민국 법을 적용합니다.
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