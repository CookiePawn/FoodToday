import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Roulette1, Roulette2, Roulette3 } from '@/assets';

const { width, height } = Dimensions.get('window');

const LoadRoulette = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const isFirstRender = useRef(true);
    const finalRotationRef = useRef(0);

    const getRandomRotation = () => {
        // 기본 회전 수 (4바퀴) + 랜덤한 추가 각도 (0-360도)
        const baseRotations = 1440; // 4 * 360
        const randomAngle = Math.floor(Math.random() * 360);
        return baseRotations + randomAngle;
    };

    const startSpinning = () => {
        // Reset the animation value
        spinValue.setValue(0);
        
        // 새로운 랜덤 각도 생성
        finalRotationRef.current = getRandomRotation();
        
        // First, rapid spinning animation
        Animated.sequence([
            // Initial fast spins
            Animated.timing(spinValue, {
                toValue: 0.75, // 75% of the total animation
                duration: 1500, // 1.5 seconds for initial fast spins
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            // Final slowing rotation
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000, // 2 seconds for the final slowing rotation
                easing: Easing.out(Easing.cubic), // Cubic easing for natural slowdown
                useNativeDriver: true,
            })
        ]).start();
    };

    useEffect(() => {
        // Component mount or remount
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        startSpinning();

        return () => {
            // Cleanup on unmount
            spinValue.stopAnimation();
            isFirstRender.current = true;
        };
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${finalRotationRef.current}deg`],
    });

    return (
        <View style={styles.container}>
            <View style={styles.rouletteContainer} />
            <View style={styles.imageContainer}>
                <Animated.Image 
                    source={Roulette1} 
                    style={[
                        styles.roulette1,
                        { transform: [{ rotate: spin }] }
                    ]} 
                />
                <Image source={Roulette2} style={styles.roulette2} />
                <Image source={Roulette3} style={styles.roulette3} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    rouletteContainer: {
        width: width,
        height: height,
    },
    imageContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    roulette1: {
        width: width * 0.7,
        height: width * 0.7,
        position: 'absolute',
        zIndex: 10,
    },
    roulette2: {
        width: width * 0.7,
        height: width * 0.7,
        position: 'absolute',
        zIndex: 9,
    },
    roulette3: {
        width: width * 0.7,
        height: width * 0.7,
        position: 'absolute',
        zIndex: 11,
    },
});

export default LoadRoulette;