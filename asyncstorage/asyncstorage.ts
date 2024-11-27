import AsyncStorage from '@react-native-async-storage/async-storage';

const testAsyncStorage = async (data: any, key: string) => {
    const startWrite = Date.now();
    await AsyncStorage.setItem(key, JSON.stringify(data));
    const endWrite = Date.now();

    const startRead = Date.now();
    const storedData = await AsyncStorage.getItem(key);
    const endRead = Date.now();

    console.log('AsyncStorage Write Time:', endWrite - startWrite, 'ms');
    console.log('AsyncStorage Read Time:', endRead - startRead, 'ms');
};
