import React, { Component } from 'react';
import { View, ActivityIndicator, Text, StatusBar, AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import { Expo } from 'expo';

import Confirm from '../components/Confirm';

// Make a component
class LoginScreen extends Component {
  state = {
    email: null,
    password: null,
    error: ' ',
    loading: false,
    showModal: false,
//
    phone: null,
    username: null,
    city: null,
    gender: 'mail',
//
    token: null,
    status: 'Not Login...'
  };

  onSignIn = async () => {
    const { email, password } = this.state;
    this.setState({ error: ' ', loading: true });
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      this.props.navigation.navigate('UserStack');
    } catch (err) {
      this.setState({ showModal: true });
    }
  }

  onCreateUser = async () => {
    const { email, password, phone, username, city, gender } = this.state;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);

//set basic info
      const { currentUser } = firebase.auth();
      let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
      await dbUserid.set({ email, phone:"", username:"", city:"", gender:"" });

      this.setState({ showModal: false });
      this.props.navigation.navigate('UserStack');
    } catch (err) {
      this.setState({
        email: '',
        password: '',
        error: err.message,
        loading: false,
        showModal: false
      });
    }
  }

  onNewUser = () => {
    this.props.navigation.navigate('NewUserScreen');
  }

  onCLoseModal = () => {
    this.setState({
      email: '',
      password: '',
      error: '',
      loading: false,
      showModal: false
    });
  }

// google login

googleLogin = async function signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      iosClientId: '863020286473-5bg2lddb9ul0s8v7u3j06j4am5seqdtb.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });
    let token = result.accessToken;
      const credential = firebase.auth.GoogleAuthProvider.credential(token);
      await firebase.auth().signInWithCredential(credential);
      const { currentUser } = await firebase.auth();
      console.log(`currentUser = ${currentUser.uid}`);
      this.props.navigation.navigate('UserStack');

    if (result.type === 'success') {
      return result.accessToken;
    } else {
      return {cancelled: true};
    }
    
  } catch(e) {
    return {error: true};
  }
}

  // googleLogin = async () => {
  //   console.log('Testing token....');
  //   let token = await AsyncStorage.getItem('google_token');

  //   if (token) {
  //     console.log('Already having a token...');
  //     this.setState({ token });
  //     this.setState({ status: 'Hello!' });

  //   } else {
  //     console.log('DO NOT having a token...');
  //     this.doGoogleLogin();
  //   }
  // };

  // doGoogleLogin = async () => {
  //   const result = await Expo.Google.logInAsync({
  //     iosClientId: '863020286473-5bg2lddb9ul0s8v7u3j06j4am5seqdtb.apps.googleusercontent.com',
  //     scopes: ['profile', 'email'],
  //   });

  //   if (result.type === 'success') {
  //     return result.accessToken;
  //   } else {
  //     return {cancelled: true};
  //   }

  //   await AsyncStorage.setItem('google_token', token);
  //   this.setState({ token });

  //   const credential = firebase.auth.GoogleAuthProvider.credential(token);

  //   // Sign in with credential from the Google user.
  //   try {
  //     await firebase.auth().signInWithCredential(credential);
  //     const { currentUser } = await firebase.auth();
  //     console.log(`currentUser = ${currentUser.uid}`);
  //     this.props.navigation.navigate('UserStack');
  //   } catch (err) {

  //   }
  // };


  renderButton() {
    if (this.state.loading) {
      return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;
    }

    return (
      <Button
        title='Sign in'
        backgroundColor='#4AAF4C'
        onPress={this.onSignIn}
        buttonStyle = {{marginTop:30}}
      />
    );
  }

  async componentDidMount() {
    await AsyncStorage.removeItem('google_token');
  }

  render() {
    const { formStyle, bk, text, textNew } = styles;
    return (
      <View style={bk}>
        <StatusBar hidden={true} />
          <Text style={text}>Medical   </Text>
          <Text style={text}>   Assistent </Text>

        <View style={formStyle}>
          <FormLabel labelStyle = {{fontSize:15, color:'white'}}>Email</FormLabel>
          <FormInput
            placeholder='user@email.com'
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            inputStyle = {{color:'white'}}
          />
          <FormLabel labelStyle = {{fontSize:15, color:'white'}}>Password</FormLabel>
          <FormInput
            secureTextEntry
            autoCorrect={false}
            autoCapitalize='none'
            placeholder='password'
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            inputStyle = {{color:'white'}}
          />
          {this.renderButton()}
          <FormValidationMessage>{this.state.error}</FormValidationMessage>
        </View>
        <View>
            <Button
              title='Sign in with Google+'
              backgroundColor='#dc4e42'
              icon={{type:'evilicon', name:'sc-google-plus', size:40}}
              onPress={this.googleLogin}
            />
        </View>
        <View style={formStyle}>
           <Text
           style={textNew}
           onPress={this.onNewUser}>
                New User?
           </Text>
        </View>
        <Confirm
          title='Are you sure to create a new user?'
          visible={this.state.showModal}
          onAccept={this.onCreateUser}
          onDecline={this.onCLoseModal}
        />
      </View>
    );
  }
}

const styles = {
  bk:{
    flex:1,
    justifyContent:'center',
    backgroundColor:"#517fa4"
  },
  formStyle: {
    marginTop: 20
  },
  text:{
    color:'white',
    fontFamily:'Zapfino',
    fontSize:30,
    alignSelf:"center",
    marginBottom:-40
  },
  textNew:{
    color:'white',
    textDecorationLine:'underline',
    alignSelf:"center",
    fontSize:15,
    marginTop:10
  }
};

export default LoginScreen;