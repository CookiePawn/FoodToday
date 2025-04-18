import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { colors } from '@/constants';
import { ArrowLeftIcon } from '@/assets';
import licenses from './licenses.json';

type LicenseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'License'>;

const License = () => {
  const navigation = useNavigation<LicenseScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon width={24} height={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>오픈소스 라이선스</Text>
      </View>
      <ScrollView style={styles.content}>
        {licenses.map((license, index) => (
          <View key={index} style={styles.licenseItem}>
            <Text style={styles.name}>{license.name}</Text>
            <Text style={styles.version}>버전: {license.version}</Text>
            <Text style={styles.license}>라이선스: {license.license}</Text>
            {license.repository !== 'N/A' && (
              <Text style={styles.repository}>저장소: {license.repository}</Text>
            )}
          </View>
        ))}
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
  },
  licenseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  license: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  repository: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default License; 