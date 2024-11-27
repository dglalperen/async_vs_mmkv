import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const testMMKV = (data: any, key: string) => {
    const startWrite = Date.now();
    storage.set(key, JSON.stringify(data));
    const endWrite = Date.now();

    const startRead = Date.now();
    const storedData = storage.getString(key);
    const endRead = Date.now();

    console.log('MMKV Write Time:', endWrite - startWrite, 'ms');
    console.log('MMKV Read Time:', endRead - startRead, 'ms');
};
