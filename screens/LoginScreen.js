import React, { Component } from 'react';
import { View, ActivityIndicator, Text, StatusBar } from 'react-native';
import * as firebase from 'firebase';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';

import Confirm from '../components/Confirm';

// Make a component
class LoginScreen extends Component {
  state = {
    email: null,
    password: null,
    error: ' ',
    loading: false,
    showModal: false
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
    const { email, password } = this.state;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
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