import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markedDates: {},
      dates: [],
      itemName: "",
    };
  }

  handleDates = (event) => {
    let dateString = event.dateString;
    if (
      this.state.dates.includes(dateString) &&
      this.state.dates.length === 1
    ) {
    } else {
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
    }
  };

  Delete = () => {
    const { navigation } = this.props;
    const createTwoButtonAlert = async () =>
      Alert.alert("Confirm Delete", "This will be deleted forever.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem(this.props.itemName);
            navigation.navigate("Home");
          },
        },
      ]);
    return (
      <TouchableOpacity
        style={{
          width: 110,
          height: 40,
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 10,
          top: 210,
          color: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          createTwoButtonAlert();
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>Delete</Text>
      </TouchableOpacity>
    );
  };

  async componentDidMount() {
    const { navigation } = this.props;
    this.willFocusSubscription = navigation.addListener("focus", () => {
      const getData = async () => {
        let data = "";
        try {
          data = await AsyncStorage.getItem(this.props.itemName);
        } catch (e) {}
        data = data.split('"');
        for (let i = 0; i < data.length; i++) {
          if (data[i].length <= 3) {
            data.splice(i, 1);
          }
        }
        this.setState({ dates: data });
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
      getData();
    });
  }

  componentWillUnmount() {
    this.willFocusSubscription();
  }

  componentDidUpdate() {
    this.willFocusSubscription();
  }

  render() {
    const { navigation } = this.props;
    const storeData = async (value) => {
      let currDate = new Date().toISOString().slice(0, 10);
      try {
        let sortArr = this.state.dates.sort();
        if (currDate > sortArr[sortArr.length - 1]) {
          Alert.alert("Please put future dates.");
        } else {
          const stringedArray = JSON.stringify(sortArr);
          await AsyncStorage.setItem(this.props.itemName, stringedArray);
        }
      } catch (e) {
        console.log(e);
      }
    };
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Text style={{ color: "white", fontSize: 64, top: 50 }}>
          {this.props.itemName}
        </Text>
        <Text style={{ color: "white", fontSize: 24, top: 65 }}>
          {this.state.dates.length} days left
        </Text>
        <View style={{ top: 110 }}>
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
          <Text style={{ color: "white", fontSize: 20 }}>Save</Text>
        </TouchableOpacity>
        <this.Delete />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    alignItems: "center",
    height: "100%",
  },
});

export default function (props) {
  const navigation = useNavigation();
  return (
    <Edit navigation={navigation} itemName={props.route.params.itemName} />
  );
}
