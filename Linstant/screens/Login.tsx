import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Link, useNavigate} from 'react-router-native';
import {styles} from './style/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    console.log('Submit', email, password);

    try {
      if (!validateEmail(email)) {
        Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail valide');
        return;
      }

      const token = await axios.post('http://10.0.2.2:3000/login', {
        email,
        password,
      });
      if (token.data.token) {
        saveTokenToStorage(token.data.token);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      Alert.alert(
        'Erreur de connexion',
        e?.response?.data || 'Veuillez verifier vos informations de connexions',
      );
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const saveTokenToStorage = async (token: string) => {
    try {
      await AsyncStorage.setItem('ACCESS_TOKEN', token);
      navigate('/');
    } catch (error) {
      console.error('Error saving token to AsyncStorage:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>L'instant</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#919396"
            onChangeText={value => setEmail(value)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Mot de passe"
            placeholderTextColor="#919396"
            secureTextEntry={true}
            onChangeText={value => setPassword(value)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={submit}>
          <Text style={styles.white}>Se connecter</Text>
        </TouchableOpacity>
        <Link to="/signup" underlayColor="transparent">
          <Text style={{...styles.link, marginTop: 15}}>
            Pas encore de compte? Créer en un
          </Text>
        </Link>
        <Link to="/reset" underlayColor="transparent">
          <Text style={{...styles.link, marginTop: 15}}>
            Mot de passe oublié ?
          </Text>
        </Link>
        <Link to="/" underlayColor="transparent">
          <View style={{marginTop: 20}}>
            <Text>Non, merci</Text>
            <Text style={styles.link}>Je veux voir directement les photos</Text>
          </View>
        </Link>
      </View>
    </ScrollView>
  );
};
