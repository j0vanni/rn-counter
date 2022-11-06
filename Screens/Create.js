import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

let currDate = new Date().toISOString().slice(0, 10);

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markedDates: {},
      dates: [currDate],
      title: "",
    };
  }

  handleDates = (event) => {
    let dateString = event.dateString;

    if (this.state.dates.includes(dateString)) {
      let newArr = this.state.dates;
      let index = newArr.indexOf(dateString);
      if (index !== -1) {
        newArr.splice(index, 1);
      }
      newArr.sort();
      this.setState({ dates: newArr });
    } else {
      this.setState({ dates: [...this.state.dates, dateString] });
    }

    this.setState(function (state) {
      let marked = {};
      state.dates.map((items) => {
        marked[items] = { selected: true };
      });
      return {
        markedDates: marked,
      };
    });
  };

  handleTitle = (event) => {
    this.setState({ title: event.target.value });
  };

  onComponentMount() {
    handleDates();
  }

  render() {
    const { navigation } = this.props;

    const storeData = async (value) => {
      try {
        let sortArr = this.state.dates.sort();
        const stringedArray = JSON.stringify(sortArr);
        await AsyncStorage.setItem(this.state.title, stringedArray);
      } catch (e) {
        Alert.alert("Event name must be more than 1 character.");
        console.log(e);
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <TextInput
            style={{
              borderWidth: 1,
              width: 400,
              height: 50,
              fontSize: 28,
              borderRadius: 10,
              top: 100,
              borderColor: "white",
              paddingLeft: 10,
              color: "white",
            }}
            onChangeText={(title) => this.setState({ title })}
            value={this.state.title}
            placeholder="Event Name"
            placeholderTextColor="white"
          />
          <View style={{ top: 140 }}>
            <Calendar
              style={{ width: 400, height: 400, backgroundColor: "#121212" }}
              theme={{
                monthTextColor: "white",
                calendarBackground: "#121212",
                dayTextColor: "white",
                textSectionTitleColor: "skyblue",
                textDisabledColor: "pink",
              }}
              markedDates={this.state.markedDates}
              onDayPress={this.handleDates}
              enableSwipeMonths={true}
              initialDate={this.state.dates[0]}
            />
          </View>
          <TouchableOpacity
            style={{
              width: 110,
              height: 40,
              borderWidth: 1,
              borderColor: "white",
              borderRadius: 10,
              top: 200,
              color: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              storeData();
              navigation.navigate("Home");
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Create Event</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    height: "100%",
  },
});

export default function (props) {
  const navigation = useNavigation();
  return <Create navigation={navigation} />;
}
