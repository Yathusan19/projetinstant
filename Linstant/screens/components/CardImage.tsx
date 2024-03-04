import React, {useState} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Share,
  Alert,
  ToastAndroid,
  Text,
} from 'react-native';
import {Iconify} from 'react-native-iconify';
import {styles} from '../style/styles';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

type TCardImage = {
  src: string;
  likeCount: number;
  id: string;
};
export const CardImage = ({src, likeCount, id}: TCardImage) => {
  const [likes, setLikes] = useState<number>(likeCount);
  const share = async () => {
    try {
      const result = await Share.share({
        title: 'Partager cette image',
        message: `http://10.0.2.2:3000/images/${src}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          Alert.prompt('Partagé avec succes');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const like = async () => {
    try {
      setLikes(likes > likeCount ? likes - 1 : likes + 1);
      await axios.patch(
        `http://10.0.2.2:3000/image/${id}/${
          likes > likeCount ? likes - 1 : likes + 1
        }`,
      );
    } catch (e) {}
  };
  const actualDownload = () => {
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      path: `${dirs.DownloadDir}/${src}`,
      fileCache: true,
    })
      .fetch('GET', `http://10.0.2.2:3000/images/${src}`, {})
      .then(() => {
        ToastAndroid.showWithGravity(
          'Your file has been downloaded to downloads folder!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      });
  };
  const downloadFile = async () => {
    try {
      actualDownload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={{padding: 5}}>
      <ImageBackground
        source={{
          uri: `http://10.0.2.2:3000/images/${src}`,
        }}
        style={styles.backgroundImage}>
        <TouchableOpacity
          style={{
            ...styles.floatingButton,
            backgroundColor: 'white',
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.17,
            shadowRadius: 3.05,
            elevation: 4,
          }}
          onPress={share}>
          <Iconify icon="material-symbols:share" size={24} color="#8dacd3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.floatingButton,
            ...styles.topLeft,
            backgroundColor: 'white',
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.17,
            shadowRadius: 3.05,
            elevation: 4,
          }}
          onPress={downloadFile}>
          <Iconify icon="material-symbols:download" size={24} color="#8dacd3" />
        </TouchableOpacity>
        {/* <View> */}
        <TouchableOpacity
          style={{
            ...styles.floatingButton,
            ...styles.topRight,
            backgroundColor: 'white',
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.17,
            shadowRadius: 3.05,
            elevation: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          onPress={() => like()}>
          <Iconify icon="iconamoon:heart-fill" size={24} color="red" />
          <Text>{likes}</Text>
        </TouchableOpacity>
        {/* </View> */}
      </ImageBackground>
    </View>
  );
};
