import React, { useEffect, useState } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { View, TouchableOpacity, Image, StyleSheet, Text, SafeAreaView, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native'
import * as MailComposer from  'expo-mail-composer'
import api from '../../services/api'

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState<Data>({} as Data);
  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
    })
  }, []);

  function handleNavigateBack () {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Mensagem via Ecoleta - Quero depositar resíduos!',
      recipients: [data.point.email],
      body: mens,
    });
  }

  function handleWhatsApp () {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=${mens}`)
  }

  if (! data.point) {
    return null;
  }

  const mens = `Olá, ${data.point.name}! 
    \nTenho interesse em deixar meus resíduos em seu ponto de coleta, como devo proceder?     
    
    \nMensagem enviada via Ecoleta`;

  return (
    <SafeAreaView style={{ flex:1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={ handleNavigateBack }>
          <Icon name="arrow-left" size={20} color="#34cb79"/>
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{uri: data.point.image}}/>
        <Text style={styles.pointName}><FontAwesome name="recycle" size={20} color="#34cb79"/> {data.point.name}</Text>
        <Text style={styles.pointItems}> 
          {data.items.map(item => item.title).join(', ')} 
        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Localidade</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Text style={styles.buttonText}>
            <Icon name="mail" size={20}/> E-mail
          </Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleWhatsApp}>
          <Text style={styles.buttonText}>
          <FontAwesome name="whatsapp" size={20}/> WhatsApp
          </Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 40,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;
