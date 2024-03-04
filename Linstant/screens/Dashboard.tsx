import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {styles} from './style/styles';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Iconify} from 'react-native-iconify';
import Modal from 'react-native-modal';
import {EventCard, TEventProps} from './components/Event';
import {getTokenFromStorage} from './Home';

export const Dashboard = () => {
  const [pickDate, setPickDate] = useState(false);
  const [pickEndDate, setPickEndDate] = useState(false);
  const [list, setList] = useState<TEventProps[]>([]);
  const [toUploadList, setToUploadList] = useState<any>();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    apiCall();
    getToken();
  });

  const getToken = async () => {
    const tokenf = await getTokenFromStorage();
    if (tokenf) {
      setToken(tokenf);
    }
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const pickImage = async () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 10,
      },
      data => processImage(data),
    );
  };
  const upload = async () => {
    let formData = new FormData();
    if (!toUploadList) {
      return Alert.alert('Erreur', 'Veuillez ajouter au moins une photo');
    }
    formData.append('description', description);
    formData.append('name', name);
    formData.append('startDate', startDate.toLocaleDateString());
    formData.append('endDate', endDate.toLocaleDateString());
    const files = toUploadList;
    if (files && files?.length > 0) {
      files.forEach(file => {
        formData.append('images', {
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        });
      });

      try {
        const response = await axios.post(
          'http://10.0.2.2:3000/uploads',
          formData,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              Authorization: token || undefined,
            },
          },
        );
        console.log('Erreur', response);
        closeDrawer();
        setToUploadList(undefined);
      } catch (e) {
        console.error('Erreur', e.message);
      }
    }
  };
  const processImage = async (files: ImagePicker.ImagePickerResponse) => {
    setToUploadList(files?.assets ? files?.assets : []);
  };

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDate(currentDate);
    setPickDate(false);
  };
  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setEndDate(currentDate);
    setPickEndDate(false);
  };

  useEffect(() => {
    apiCall();
  });
  const apiCall = async () => {
    const response = await axios.get('http://10.0.2.2:3000/events', {
      headers: {Authorization: token},
    });
    setList(response.data);
  };

  const onDelete = async (_id: string) => {
    await axios.delete(`http://10.0.2.2:3000/event/${_id}`);
    apiCall();
  };

  const alertDelete = (_id: string) =>
    Alert.alert(
      'Vous voulez vraiment supprimer?',
      'Cette action est irreversible',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => onDelete(_id),
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );

  return (
    <SafeAreaView style={styles.container2}>
      <View style={styles.container2}>
        <Modal
          coverScreen
          isVisible={isDrawerOpen}
          animationIn="slideInRight"
          animationOut="slideOutRight">
          <View style={{...styles.container2, padding: 16}}>
            <Text style={{...styles.title, fontSize: 25}}>
              Ajout d'une nouvelle évènement
            </Text>
            <ScrollView style={{flex: 1}}>
              <View>
                {pickDate && (
                  <DateTimePicker
                    value={startDate}
                    mode={'date'}
                    is24Hour={true}
                    onPointerEnter={() => setPickDate(false)}
                    onPointerCancel={() => setPickDate(false)}
                    onChange={onStartChange}
                    locale="fr"
                  />
                )}
                {pickEndDate && (
                  <DateTimePicker
                    value={endDate}
                    mode={'date'}
                    is24Hour={true}
                    onPointerEnter={() => setPickEndDate(false)}
                    onPointerCancel={() => setPickEndDate(false)}
                    onChange={onEndChange}
                    locale="fr"
                  />
                )}
                <View>
                  <Text>Nom de l'evenement</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      style={styles.TextInput}
                      placeholder="Nom de l'evenement"
                      placeholderTextColor="#919396"
                      onChangeText={value => setName(value)}
                    />
                  </View>

                  <Text>Date de debut de l'evenement</Text>
                  <TouchableOpacity
                    style={{...styles.inputView}}
                    onPress={() => setPickDate(!pickDate)}>
                    <Text style={styles.TextInput}>
                      {startDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  <Text>Date de fin de l'evenement</Text>
                  <TouchableOpacity
                    style={{...styles.inputView}}
                    onPress={() => setPickEndDate(!pickDate)}>
                    <Text style={styles.TextInput}>
                      {endDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  <Text>Description de l'evenement</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      style={styles.TextInput}
                      placeholder="Description"
                      placeholderTextColor="#919396"
                      onChangeText={value => setDescription(value)}
                    />
                  </View>

                  <TouchableOpacity style={styles.loginBtn} onPress={upload}>
                    <Text style={styles.white}>Creer l'evenement</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={pickImage} style={{flex: 1}}>
                    <Iconify icon="mdi:image-add" size={50} color="black" />
                  </TouchableOpacity>
                  <ScrollView>
                    <View>
                      {toUploadList?.map(e => (
                        <ImageBackground
                          source={{
                            uri: e.uri,
                          }}
                          style={styles.backgroundImage}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={closeDrawer}
              style={{...styles.floatingButton, ...styles.backgroundBase}}>
              <Iconify icon="ic:round-arrow-back-ios" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={{flex: 1, backgroundColor: '#f6f6f6'}}>
          <Text style={{fontSize: 24, paddingHorizontal: 10}}>
            Mes évènements
          </Text>
          <ScrollView style={{flex: 1, padding: 16}}>
            <View>
              <View style={{display: 'flex', gap: 15, paddingBottom: 100}}>
                {list?.map(e => (
                  <EventCard {...e} key={e._id} onDelete={alertDelete} />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity
        onPress={openDrawer}
        style={{...styles.floatingButton, ...styles.backgroundBase}}>
        <Iconify icon="mdi:add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
