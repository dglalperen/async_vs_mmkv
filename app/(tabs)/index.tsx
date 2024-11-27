import React, { useState } from 'react';
import { Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

export default function HomeScreen() {
    const screen_width = Dimensions.get('screen').width;
    const screen_height = Dimensions.get('screen').height;

    const storage = new MMKV();

    const [results, setResults] = useState({
        asyncStorageWrite: '-',
        asyncStorageRead: '-',
        mmkvWrite: '-',
        mmkvRead: '-',
    });

    const [performanceDifference, setPerformanceDifference] = useState({
        write: '-',
        read: '-',
    });

    const generateLargeData = size =>
        Array.from({ length: size }, (_, i) => ({
            id: i + 1,
            name: `Item ${i + 1}`,
            description: `This is a description for item ${i + 1}.`,
            details: { createdAt: new Date().toISOString() },
        }));

    const largeData = generateLargeData(5000); // Larger dataset for stronger testing

    const calculatePerformanceDifference = () => {
        const asyncWrite = parseInt(results.asyncStorageWrite.split(' ')[0], 10);
        const mmkvWrite = parseInt(results.mmkvWrite.split(' ')[0], 10);
        const asyncRead = parseInt(results.asyncStorageRead.split(' ')[0], 10);
        const mmkvRead = parseInt(results.mmkvRead.split(' ')[0], 10);

        const calculateGain = (asyncTime, mmkvTime) =>
            asyncTime > 0 ? ((asyncTime - mmkvTime) / asyncTime) * 100 : 0;

        setPerformanceDifference({
            write: `${calculateGain(asyncWrite, mmkvWrite).toFixed(2)}%`,
            read: `${calculateGain(asyncRead, mmkvRead).toFixed(2)}%`,
        });
    };

    const testAsyncStorage = async () => {
        const key = 'asyncLargeData';
        const iterations = 50; // Increase iterations for a longer test

        const startWrite = Date.now();
        for (let i = 0; i < iterations; i++) {
            await AsyncStorage.setItem(`${key}_${i}`, JSON.stringify(largeData));
        }
        const endWrite = Date.now();

        const startRead = Date.now();
        for (let i = 0; i < iterations; i++) {
            await AsyncStorage.getItem(`${key}_${i}`);
        }
        const endRead = Date.now();

        setResults(prev => ({
            ...prev,
            asyncStorageWrite: `${endWrite - startWrite} ms`,
            asyncStorageRead: `${endRead - startRead} ms`,
        }));
    };

    const testMMKV = () => {
        const key = 'mmkvLargeData';
        const iterations = 50;

        const startWrite = Date.now();
        for (let i = 0; i < iterations; i++) {
            storage.set(`${key}_${i}`, JSON.stringify(largeData));
        }
        const endWrite = Date.now();

        const startRead = Date.now();
        for (let i = 0; i < iterations; i++) {
            storage.getString(`${key}_${i}`);
        }
        const endRead = Date.now();

        setResults(prev => ({
            ...prev,
            mmkvWrite: `${endWrite - startWrite} ms`,
            mmkvRead: `${endRead - startRead} ms`,
        }));
    };

    const startTest = async () => {
        await testAsyncStorage();
        testMMKV();
        setTimeout(calculatePerformanceDifference, 1500); // Delay to ensure tests complete
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#222' }}>
            <Text style={{ color: '#FFD700', fontSize: 32, fontWeight: 'bold', marginTop: 20 }}>
                Async Storage vs MMKV
            </Text>

            <Text style={{ color: '#FFD700', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
                Writing and reading a dataset of 5000 objects (simulated app data).
                {'\n'}Each object includes an ID, name, description, and timestamp.
            </Text>

            <View style={{ marginTop: 30, width: screen_width * 0.9 }}>
                <View
                    style={{
                        padding: 20,
                        borderWidth: 2,
                        borderColor: '#FFD700',
                        borderRadius: 10,
                        marginBottom: 20,
                    }}>
                    <Text style={{ color: '#FFD700', fontSize: 24, textAlign: 'center' }}>
                        Test Results
                    </Text>
                    <Text style={{ color: '#FFD700', marginTop: 10 }}>
                        AsyncStorage Write: {results.asyncStorageWrite}
                    </Text>
                    <Text style={{ color: '#FFD700' }}>
                        AsyncStorage Read: {results.asyncStorageRead}
                    </Text>
                    <Text style={{ color: '#FFD700', marginTop: 10 }}>
                        MMKV Write: {results.mmkvWrite}
                    </Text>
                    <Text style={{ color: '#FFD700' }}>MMKV Read: {results.mmkvRead}</Text>
                    <Text style={{ color: '#FFD700', marginTop: 10, fontWeight: 'bold' }}>
                        Performance Improvement
                    </Text>
                    <Text style={{ color: '#FFD700' }}>Write: {performanceDifference.write}</Text>
                    <Text style={{ color: '#FFD700' }}>Read: {performanceDifference.read}</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={startTest}
                style={{
                    backgroundColor: '#FFD700',
                    padding: 15,
                    borderRadius: 10,
                    width: screen_width * 0.6,
                    alignItems: 'center',
                }}>
                <Text style={{ color: '#222', fontSize: 20, fontWeight: 'bold' }}>Start Test</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
