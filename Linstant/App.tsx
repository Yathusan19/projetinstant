/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';

import {NativeRouter, Route, Routes, useNavigate} from 'react-router-native';

import {Home} from './screens/Home';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Login} from './screens/Login';
import {BackHandler} from 'react-native';
import {Dashboard} from './screens/Dashboard';
import {SignUp} from './screens/Signup';
import {ResetPassword} from './screens/ResetPassword';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NativeRouter>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AppRoutes />
    </NativeRouter>
  );
}

export const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const backAction = () => {
      navigate(-1);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reset" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
