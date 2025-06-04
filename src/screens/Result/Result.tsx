import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image, SafeAreaView } from 'react-native';
import { colors } from '@/constants';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models';
import { GlobeIcon, MapPinIcon, PhoneIcon } from '@/assets';
import { AdBanner} from '@/components';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { searchRestaurantImage } from '@/services';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const Result = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const { restaurant } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
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
    const loadImage = async () => {
      setImageLoading(true);
      try {
        const addressParts = restaurant.address.split(' ');
        const region = addressParts[0] + ' ' + addressParts[1];
        const title = restaurant.title.replace(/<b>/g, '').replace(/<\/b>/g, '');
        const searchQuery = `${region} ${title}`;
        
        const fetchedImageUrl = await searchRestaurantImage(searchQuery);
        setImageUrl(fetchedImageUrl);
        
      } catch (error) {
        console.error('Error loading image via API:', error);
        setImageUrl(null);
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();
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
    const searchQuery = `${region} ${title} 식당`;
      
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(searchQuery.replace(/<b>/g, '').replace(/<\/b>/g, ''))}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>추천 음식점</Text>
        </View>

        <View style={styles.imageContainer}>
          {imageLoading ? (
            <View style={styles.skeletonContainer}>
              <Animated.View style={[styles.skeletonShimmer, skeletonStyle]} />
            </View>
          ) : imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>이미지 없음</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <View style={styles.categoryImageContainer}>
              {/* <Image source={require('@/assets/images/category.png')} style={styles.categoryImage} /> */}
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{restaurant.title.replace(/<b>/g, '').replace(/<\/b>/g, '')}</Text>
              <Text style={styles.category}>{restaurant.category}</Text>
            </View>
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
            onPress={() => navigation.replace('FindAndroid')}
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
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.gray600,
  },
  subText: {
    fontSize: 16,
    color: colors.gray500,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  image: {
    width: '100%',
    height: 300,
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
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryImageContainer: {
    width: 45,
    height: 45,
    backgroundColor: colors.gray100,
    borderRadius: 10,
  },
  categoryImage: {
    width: 30,
    height: 30,
  },
  titleRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 5,
  },
  category: {
    fontSize: 12,
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
    fontSize: 14,
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
    backgroundColor: colors.secondary,  
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
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray100,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: colors.gray400,
    fontSize: 16,
  },
});

export default Result;