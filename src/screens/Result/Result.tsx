import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image, SafeAreaView } from 'react-native';
import { colors } from '@/constants';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { GlobeIcon, MapPinIcon, PhoneIcon } from '@/assets';
import AdBanner from '@/components/AdBanner';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const Result = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const { restaurant } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(400, { duration: 1500, easing: Easing.linear }),
        withTiming(-200, { duration: 0 })
      ),
      -1
    );
  }, []);

  const skeletonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const addressParts = restaurant.address.split(' ');
        const region = addressParts[0] + ' ' + addressParts[1];
        const searchQuery = `${region} ${restaurant.title}`;
        const url = `https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${encodeURIComponent(searchQuery)}&filter=1&cate=food`;
        
        const response = await fetch(url);
        const html = await response.text();
        
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
    const title = restaurant.title.replace(/<b>/g, '').replace(/<\/b>/g, '');
    
    // 모든 검색어에 음식 키워드 추가
    const searchQuery = `${region} ${title} 음식`;
      
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(searchQuery)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>음식점을 추천해드렸습니다!</Text>
          <Text style={styles.subText}>맛있는 식사 되세요~</Text>
        </View>

        <View style={styles.imageContainer}>
          {!imageUrl ? (
            <View style={styles.skeletonContainer}>
              <Animated.View style={[styles.skeletonShimmer, skeletonStyle]} />
            </View>
          ) : (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
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
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: colors.gray500,
  },
  imageContainer: {
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  skeletonContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray100,
    overflow: 'hidden',
    borderRadius: 8,
    marginBottom: 16,
  },
  skeletonShimmer: {
    width: '100%',
    height: '200%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '45deg' }],
  },
  content: {
    padding: 24,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: colors.gray500,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.gray600,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  mapButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    flex: 1,
  },
  retryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    flex: 1,
  },
  mapButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Result;