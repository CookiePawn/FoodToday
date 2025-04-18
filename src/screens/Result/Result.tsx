import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { colors } from '@/constants';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { GlobeIcon, MapPinIcon, PhoneIcon } from '@/assets';
import AdBanner from '@/components/AdBanner';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const Result = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const { restaurant } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const addressParts = restaurant.address.split(' ');
        const region = addressParts[0] + ' ' + addressParts[1];
        const searchQuery = `${region} ${restaurant.title}`;
        const url = `https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${encodeURIComponent(searchQuery)}&filter=1&cate=food`;
        
        const response = await fetch(url);
        const html = await response.text();
        
        // 정규식으로 originalUrl 추출
        const originalUrlMatch = html.match(/originalUrl:"([^"]+)"/);
        if (originalUrlMatch && originalUrlMatch[1]) {
          setImageUrl(originalUrlMatch[1]);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [restaurant]);

  const handleCall = () => {
    if (restaurant.telephone) {
      Linking.openURL(`tel:${restaurant.telephone}`);
    }
  };

  const handleMap = () => {
    const addressParts = restaurant.address.split(' ');
    const region = addressParts[0] + ' ' + addressParts[1];
    const searchQuery = `${region} ${restaurant.title}`;
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(searchQuery)}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <AdBanner />
      <View style={styles.card}>
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.header}>
          <Text style={styles.title}>{restaurant.title.replace(/<b>/g, '').replace(/<\/b>/g, '')}</Text>
          <Text style={styles.category}>{restaurant.category}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MapPinIcon width={20} height={20} fill={colors.white} stroke={colors.primary} strokeWidth={2} />
            <Text style={styles.infoText}>{restaurant.address}</Text>
          </View>

          {restaurant.telephone && (
            <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
              <PhoneIcon width={20} height={20} fill={colors.white} stroke={colors.primary} strokeWidth={2} />
              <Text style={styles.infoText}>{restaurant.telephone}</Text>
            </TouchableOpacity>
          )}

          {restaurant.link && (
            <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(restaurant.link)}>
              <GlobeIcon width={20} height={20} fill={colors.white} stroke={colors.primary} strokeWidth={2} />
              <Text style={styles.infoText}>웹사이트 보기</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.mapButton} onPress={handleMap}>
          <Text style={styles.mapButtonText}>지도에서 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.mapButton, styles.retryButton]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.mapButtonText, { color: colors.gray500 }]}>다시하기</Text>
        </TouchableOpacity>
      </View>
      <AdBanner />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.gray600,
    flex: 1,
  },
  mapButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginTop: 8,
  },
  mapButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default Result;