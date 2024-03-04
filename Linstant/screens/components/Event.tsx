import React from 'react';
import {
  Dimensions,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {TImages} from '../Home';
import {styles} from '../style/styles';
import {Iconify} from 'react-native-iconify';

export type TEventProps = {
  images: TImages[];
  user: string;
  name: string;
  _id: string;
  startDate: Date;
  endDate: Date;
  description: string;
  onDelete: (_id: string) => void;
};

export const EventCard = ({
  images,
  name,
  startDate,
  endDate,
  description,
  onDelete,
  _id,
}: TEventProps) => {
  const width = Dimensions.get('window').width;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.16,
        shadowRadius: 1.51,
        elevation: 2,
        margin: 4,
      }}>
      <Carousel
        loop
        width={width - 20}
        height={width / 2}
        autoPlay={true}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={({index}) => (
          <ImageBackground
            source={{
              uri: `http://10.0.2.2:3000/images/${images[index].name}`,
            }}
            style={styles.backgroundImage}
          />
        )}
      />
      <View style={{display: 'flex', gap: 10, paddingHorizontal: 10}}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>{name}</Text>
        <Text style={{color: '#2ba2e4'}}>
          {new Date(startDate).toLocaleDateString()} au{' '}
          {new Date(endDate).toLocaleDateString()}
        </Text>
        <Text>{description}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
            <Iconify icon="mdi:heart-outline" size={20} color="black" />
            <Text>
              {images.reduce((accumulator, currentObject) => {
                return accumulator + currentObject.likeCount;
              }, 0)}{' '}
              like(s)
            </Text>
          </View>
          <TouchableOpacity onPress={() => onDelete(_id)}>
            <Iconify
              icon="material-symbols-light:delete"
              size={30}
              color="red"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
