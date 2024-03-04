import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {Link} from 'react-router-native';

import axios from 'axios';

export type TImages = {
  _id: string;
  name: string;
  user: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
};

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {CardImage} from './components/CardImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './style/styles';

export const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');
    return token;
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('ACCESS_TOKEN');
  } catch (error) {
    console.error('Error Loging out', error);
    return null;
  }
};

export const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [list, setList] = useState<TImages[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    apiCall();
    getToken();
  }, []);

  const getToken = async () => {
    const tokenf = await getTokenFromStorage();
    if (tokenf) {
      setToken(tokenf);
    }
  };

  const onLogout = async () => {
    logout();
    setToken(null);
  };

  const apiCall = async () => {
    const response = await axios.get('http://10.0.2.2:3000/images');
    setList(response.data);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <View>
          {token ? (
            <View style={styles.homeLinkContainer}>
              <Link to="/dashboard" underlayColor="transparent">
                <View style={styles.homeLink}>
                  <Text style={{color: 'white'}}>Dashboard</Text>
                </View>
              </Link>
              <TouchableOpacity onPress={onLogout} style={styles.homeLink}>
                <Text style={{color: 'white'}}>Se deconnecter</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.homeLinkContainer}>
              <Link to="/login" underlayColor="transparent">
                <View style={styles.homeLink}>
                  <Text style={{color: 'white'}}>Se connecter</Text>
                </View>
              </Link>
              <Link to="/signup" underlayColor="transparent">
                <View style={styles.homeLink}>
                  <Text style={{color: 'white'}}>S'inscrire</Text>
                </View>
              </Link>
            </View>
          )}
          <View>
            {list?.map((e, index) => (
              <CardImage
                src={e.name}
                likeCount={e.likeCount}
                key={index}
                id={e._id}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
