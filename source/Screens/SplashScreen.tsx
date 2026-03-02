import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Languages from '../Common/Languages';

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Gia_%C4%90%C3%ACnh_Ph%E1%BA%ADt_T%E1%BB%AD_Vi%E1%BB%87t_Nam_logo.svg/512px-Gia_%C4%90%C3%ACnh_Ph%E1%BA%ADt_T%E1%BB%AD_Vi%E1%BB%87t_Nam_logo.svg.png" }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
      <Text style={styles.titleText}>
        {Languages.get('splash.title')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    marginBottom: 24,
    transform: [{ scale: 1.1 }],
  },
  logoWrapper: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    padding: 4,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008A45',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    lineHeight: 32,
  }
});

export default SplashScreen;
