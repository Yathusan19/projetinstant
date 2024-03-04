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

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [registerInfo, setRegisterInfo] = useState<{
    password: string;
    passwordConfirm: string;
  }>({
    password: '',
    passwordConfirm: '',
  });
  const [resetToken, setResetToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      if (!validateEmail(email)) {
        Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail valide');
        return;
      }
      const data = await axios.post('http://10.0.2.2:3000/forgot-password', {
        email,
      });
      if (data.data.resetToken) {
        setResetToken(data.data.resetToken);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      Alert.alert(
        'Erreur de connexion',
        e?.response?.data || 'Veuillez verifier votre email',
      );
    }
  };

  const postNewPassword = async () => {
    try {
      if (registerInfo.password !== registerInfo.passwordConfirm) {
        Alert.alert('', 'Les mots de passe ne correspondent pas');
        return;
      }
      const data = await axios.post('http://10.0.2.2:3000/reset-password', {
        resetToken,
        newPassword: registerInfo.password,
      });
      Alert.alert(
        'Succès!',
        'Votre mot de passe a bien été réinitialiser! Veuillez vous connectez!',
        [
          {
            text: 'OK',
            onPress: () => navigate('/login'),
            style: 'destructive',
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        },
      );
    } catch (e) {
      console.log('Error', e.response.data);
      Alert.alert(
        'Erreur de connexion',
        e?.response?.data || 'Veuillez verifier votre email',
      );
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Reinitialiser mon mot de passe</Text>
        {resetToken ? (
          <>
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
          </>
        ) : (
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Email"
              placeholderTextColor="#919396"
              onChangeText={value => setEmail(value)}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={resetToken ? postNewPassword : submit}>
          <Text style={styles.white}>
            {resetToken ? 'Modifier mon mot de passe' : 'Reinitialiser'}
          </Text>
        </TouchableOpacity>
        <Link to="/login" underlayColor="transparent">
          <Text style={{...styles.link, marginTop: 15}}>Se connecter</Text>
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
