import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import WText from '../Common/WText';
import Languages from '../Common/Languages';

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../Images/ic_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
      <WText type="medium24" style={styles.titleText}>
        {Languages.get('splash.title')}
      </WText>
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
    color: '#008A45',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  }
});

export default SplashScreen;
