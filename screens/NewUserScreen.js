import React, { Component } from 'react';
import { View, Picker, ActivityIndicator, ScrollView, Text } from 'react-native';
import * as firebase from 'firebase';

import { FormLabel, FormInput, Button, CheckBox } from 'react-native-elements';

// Make a component
class NewUserScreen extends Component {
  state = {
    email: null,
    phone: null,
    username: null,
    city: null,
    gender: 'mail',
    saving: false,
//
    password: null,
    error: ' ',
  };

  onSaveInfo = async () => {
    const { email, password, phone, username, city, gender } = this.state;
    this.setState({ saving: true });
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      
      const { currentUser } = firebase.auth();
      let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
      await dbUserid.set({ email:email || " ", phone:phone || " ", username:username || " ", city:city || " ", gender:gender || " " });

      this.props.navigation.navigate('UserStack');
      this.setState({ saving: false });
    } catch (err) {
      this.setState({
        email: '',
        password: '',
        error: err.message,
        saving: false
      });
    }
  }

  renderButton() {
    if (this.state.saving) {
      return <ActivityIndicator size='large' />;
    }

    return (
      <Button
        title='Sign up'
        onPress={this.onSaveInfo}
        backgroundColor='#4AAF4C'
        buttonStyle = {{marginTop:30}}
      />
    );
  }

  onCancel = () => {
    this.props.navigation.navigate('LoginScreen');
  }

  render() {
    console.log(this.state);
    return (
      <ScrollView>
      <View style={styles.formStyle}>
        <FormLabel>Email</FormLabel>
        <FormInput
          placeholder='user@email.com'
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='email-address'
          onChangeText={email => this.setState({ email })}
        />
        <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry
            autoCorrect={false}
            autoCapitalize='none'
            placeholder='password'
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
        <FormLabel>Username</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='John Doe'
          onChangeText={username => this.setState({ username })}
        />
        <FormLabel>Phone</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='555-555-5555'
          onChangeText={phone => this.setState({ phone })}
        />
        <FormLabel>City</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='Taipei city'
          onChangeText={city => this.setState({ city })}
        />
        <Picker
          style={styles.pickerStyle}
          selectedValue={this.state.gender}
          onValueChange={gender => this.setState({ gender })}
        >
          <Picker.Item label="Mail" value="mail" />
          <Picker.Item label="Femail" value="femail" />
        </Picker>
        {this.renderButton()}

        <Text
           style={styles.textCancel}
           onPress={this.onCancel}>
                Cancel
           </Text>

      </View>
      </ScrollView>
    );
  }
}

const styles = {
  formStyle: {
    marginTop: 50
  },
  pickerStyle:{
    marginTop:-30,
    marginBottom:-30
  },
  textCancel:{
    color:'#bbbbbb',
    textDecorationLine:'underline',
    alignSelf:"center",
    fontSize:15,
    marginTop:30,
    marginBottom:50
  }
};

export default NewUserScreen;