import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: '40%',
  },
  container2: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  title: {
    marginBottom: 40,
    fontWeight: 'bold',
    fontSize: 35,
    color: '#000',
  },
  inputView: {
    borderRadius: 5,
    width: '100%',
    height: 45,
    marginBottom: 20,
    backgroundColor: '#fafafa',
    borderColor: '#ebebeb',
    borderWidth: 1,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: '#555555',
  },
  loginBtn: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    height: 45,
    backgroundColor: '#8dacd3',
  },
  link: {
    color: '#8dacd3',
    textDecorationLine: 'underline',
  },
  white: {
    color: 'white',
  },
  gray: {
    color: '555555',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    overflow: 'hidden',
  },
  Image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    height: 110,
    width: 250,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  itemsCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  floatingButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    left: 10,
    bottom: 10,
  },
  topLeft: {
    left: 10,
    top: 10,
  },
  topRight: {
    left: '85%',
    top: 10,
  },
  backgroundBase: {
    backgroundColor: '#8dacd3',
  },
  baseColor: {
    color: '#8dacd3',
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  homeLink: {
    paddingHorizontal: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    height: 30,
    backgroundColor: '#8dacd3',
  },
  homeLinkContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
