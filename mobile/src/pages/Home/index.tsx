import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import axios from 'axios'
import { View, ImageBackground, Image, StyleSheet, TextInput, Text, KeyboardAvoidingView, Platform  } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';

/**
 * Componente da homepage
 */

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [uf, setUF] = useState('');
  const [city, setCity] = useState('');
  const [ufs, setUFs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  function handleNavigateToPoints() {

    navigation.navigate('Points', {
      uf,
      city,
    });
  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitial = response.data.map(uf => uf.sigla)
        setUFs(ufInitial);  
        console.log(ufs);
      });
  },[]);

  useEffect(() => {
    if (uf === '0') {
        return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
    .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
    });
  }, [uf]);

  return (
    <KeyboardAvoidingView style={{flex: 1}}behavior = {Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
      style={styles.container} 
      source={require('../../assets/home-background.png')}
      imageStyle={{ width:274, height:368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Encontre pontos de coleta com eficiência</Text>
          </View>
        </View>

        <View style={styles.footer}>
        <RNPickerSelect
              onValueChange={(value) => setUF(value)}
              placeholder = {{label: "UF", value:'0'}}
              items={
                ufs.map(uf => ({
                  label: uf,
                  value: uf,
                }))
              }
          />
          <RNPickerSelect
              onValueChange={(value) => setCity(value)}
              placeholder = {{label: "Cidade", value:'0'}}
              items={
                cities.map(city => ({
                  label: city,
                  value: city,
                }))
              }
          />
          <RectButton style={styles.button} onPress={ handleNavigateToPoints }>
            <View style={styles.buttonIcon}>
              <Text> 
                <Icon name="arrow-right" color="#FFF" size={24}/> 
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Encontre o ponto mais próximo
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;