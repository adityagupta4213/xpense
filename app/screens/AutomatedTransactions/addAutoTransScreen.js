import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '../../firebase/config';
import {Picker} from '@react-native-community/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import vars from '../../shared/globalVars';

export default function addAutoTransScreen({navigation}) {
  const [category, setCategory] = useState({
    name: 'Select Category',
    iconName: 'checkmark-circle-outline',
    color: vars.colors.ltGray,
  });
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('0');
  const [selectedType, setSelectedType] = useState('spent');
  const [frequency, setFrequency] = useState();

  const sanitizeAmountInput = (text) => {
    // only allow input of upto 2 digits after the decimal point
    if (text.indexOf('.') !== -1) {
      text = text.split('.');
      if (text.length == 2 && text[1].length > 2) {
        text[1] = text[1].slice(0, 2);
        return text.join('.');
      } else return text.join('.');
    } else return text.replace(/[^\d]/g, ''); // regex to replace any non-numeric values
  };

  const handleAddItem = () => {
    if (sanitizeAmountInput(amount) <= 0) {
      return alert('Invalid amount');
    }
    if (!title) {
      return alert('Invalid title');
    }
    if (!frequency) {
      return alert('Please select a frequency');
    }
    // Copy values to the datamodel object
    const dataModel = {
      frequency: frequency,
      category: category.name,
      title: title,
      amount: sanitizeAmountInput(amount),
      type: selectedType,
      lastTransactionDate: Date.now(),
    };
    // Get the user data doc
    vars.docRef
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        // Update the user data doc
        var userData = doc.data();
        userData.automatedTransactions.push(dataModel);
        vars.docRef
          .doc(firebase.auth().currentUser.uid)
          .set(userData)
          .then(() => {
            alert('Added');
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleCancelItem = () => {
    navigation.navigate('App');
  };
  const handleCategory = () => {
    navigation.navigate('categoryScreen', {onSelect: setCategory});
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        {/* Transaction Category wrapper */}
        <View style={styles.transactionTypeContainer}>
          {/* Highlight the selected button - earned */}
          <TouchableOpacity
            style={[
              styles.button,
              selectedType === 'earned'
                ? styles.buttonActivated
                : styles.buttonInActivated,
            ]}
            onPress={() => setSelectedType('earned')}>
            <Text
              style={[
                styles.buttonTitle,
                selectedType === 'earned'
                  ? styles.buttonActivatedTitle
                  : styles.buttonInActivatedTitle,
              ]}>
              Earned
            </Text>
          </TouchableOpacity>
          {/* Highlight the selected button - spent */}
          <TouchableOpacity
            style={[
              styles.button,
              selectedType === 'spent'
                ? styles.buttonActivated
                : styles.buttonInActivated,
            ]}
            onPress={() => setSelectedType('spent')}>
            <Text
              style={[
                styles.buttonTitle,
                selectedType === 'spent'
                  ? styles.buttonActivatedTitle
                  : styles.buttonInActivatedTitle,
              ]}>
              Spent
            </Text>
          </TouchableOpacity>
        </View>
        {/* Transaction title input element */}
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setTitle(text)}
          value={title}
          underlineColorAndroid={vars.colors.highlight}
          autoCapitalize="words"
        />
        {/* Wrap amount text input and category picker into one line */}
        <View style={styles.amtCatContainer}>
          {/* Transaction amount input element */}
          <TextInput
            style={styles.amount}
            placeholder="Amount"
            keyboardType="numeric"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setAmount(sanitizeAmountInput(text))}
            value={amount}
            underlineColorAndroid={vars.colors.highlight}
            autoCapitalize="words"
          />
          {/* Transaction category picker element */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonInActivated,
              {backgroundColor: category.color},
            ]}
            onPress={() => handleCategory()}>
            <Ionicons name={category.iconName} style={styles.categoryIcon} />
            <Text
              style={[
                styles.buttonTitle,
                styles.buttonInActivatedTitle,
                styles.categoryButtonTitle,
              ]}>
              {vars.truncate(category.name, 10)}
            </Text>
          </TouchableOpacity>
        </View>
        <Picker
          selectedValue={frequency}
          style={styles.frequencyPicker}
          onValueChange={(itemValue, itemIndex) => setFrequency(itemValue)}>
          <Picker.Item label="Select Frequency" value="" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Yearly" value="yearly" />
        </Picker>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        {/* cancel button */}
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleCancelItem()}>
          <Ionicons name="close-outline" style={styles.footerButtonTitle} />
        </TouchableOpacity>
        {/* Add button */}
        <TouchableOpacity
          style={[styles.footerButton, styles.buttonActivated]}
          onPress={() => handleAddItem()}>
          <Ionicons
            name="checkmark-outline"
            style={[styles.footerButtonTitle, styles.buttonActivatedTitle]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  transactionTypeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: 20,
    marginVertical: 40,
    fontSize: 18,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    height: 48,
    borderRadius: 5,
  },
  buttonInActivated: {
    backgroundColor: vars.colors.ltGray,
  },
  buttonActivated: {
    backgroundColor: vars.colors.highlight,
  },
  buttonTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonInActivatedTitle: {
    color: vars.colors.dkGray,
  },
  buttonActivatedTitle: {
    color: '#ffffff',
  },
  categoryButtonTitle: {
    flex: 2,
    textAlign: 'left',
    color: '#000000',
  },
  categoryIcon: {
    flex: 1,
    width: 26,
    paddingLeft: 10,
    fontSize: 26,
  },
  amtCatContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 40,
  },
  amount: {
    flex: 1,
    fontSize: 18,
  },
  categories: {
    flex: 1,
    marginLeft: 10,
  },
  frequencyPicker: {
    marginHorizontal: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '105%',
    flex: 1,
    flexDirection: 'row',
    padding: 0,
  },
  footerButton: {
    flex: 1,
    margin: 0,
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 0,
    backgroundColor: vars.colors.ltGray,
  },
  footerButtonTitle: {
    fontSize: 26,
  },
});
