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
    saving: false
  };

  onSaveInfo = async () => {
    this.setState({ saving: true });
    const { currentUser } = firebase.auth();
    const { email, phone, username, city, gender } = this.state;
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    await dbUserid.set({ email, phone, username, city, gender });
    this.setState({ saving: false });
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
        <FormLabel>Username</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='John Doe'
          value={this.state.username}
        />
        <FormLabel>Email</FormLabel>
        <FormInput
          placeholder='user@email.com'
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='email-address'
          value={this.state.email}
        />
        <FormLabel>Phone</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='555-555-5555'
          value={this.state.phone}
        />
        <FormLabel>City</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder='Taipei city'
          value={this.state.city}
        />
        <Picker
          style={styles.pickerStyle}
          selectedValue={this.state.gender}
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