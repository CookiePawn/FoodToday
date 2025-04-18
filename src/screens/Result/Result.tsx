import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/models';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const Result = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const { restaurant } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.title}</Text>
      <Text style={styles.category}>{restaurant.category}</Text>
      <Text style={styles.address}>{restaurant.address}</Text>
      {restaurant.telephone && <Text style={styles.telephone}>{restaurant.telephone}</Text>}
      <Text style={styles.description}>{restaurant.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  category: {
    fontSize: 18,
    color: colors.secondary,
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: 10,
  },
  telephone: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: colors.gray500,
  },
});

export default Result;