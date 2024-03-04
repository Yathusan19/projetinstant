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

export const SignUp = () => {
  const [registerInfo, setRegisterInfo] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submit = async () => {
    try {
      // Validate email
      if (!validateEmail(registerInfo.email)) {
        Alert.alert(
          "Erreur d'inscription",
          'Veuillez entrer une adresse e-mail valide',
        );
        return;
      }

      // Validate password confirmation
      if (registerInfo.password !== registerInfo.passwordConfirm) {
        Alert.alert(
          "Erreur d'inscription",
          'Les mots de passe ne correspondent pas',
        );
        return;
      }

      const token = await axios.post(
        'http://10.0.2.2:3000/register',
        registerInfo,
      );
      if (token.data.token) {
        saveTokenToStorage(token.data.token);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      Alert.alert(
        "Erreur d'inscription",
        e?.response?.data || 'Veuillez verifier vos informations de connexions',
      );
    }
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
            placeholder="Nom"
            placeholderTextColor="#919396"
            onChangeText={value =>
              setRegisterInfo({...registerInfo, firstname: value})
            }
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Prenom"
            placeholderTextColor="#919396"
            onChangeText={value =>
              setRegisterInfo({...registerInfo, lastname: value})
            }
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#919396"
            onChangeText={value =>
              setRegisterInfo({...registerInfo, email: value})
            }
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Mot de passe"
            placeholderTextColor="#919396"
            secureTextEntry={true}
            onChangeText={value =>
              setRegisterInfo({...registerInfo, password: value})
            }
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Confirmation Mot de passe"
            placeholderTextColor="#919396"
            secureTextEntry={true}
            onChangeText={value =>
              setRegisterInfo({...registerInfo, passwordConfirm: value})
            }
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={submit}>
          <Text style={styles.white}>S'inscrire</Text>
        </TouchableOpacity>
        <Link to="/login" underlayColor="transparent">
          <Text style={{...styles.link, marginTop: 15}}>
            Vous avez deja un compte? connectez-vous ici
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
