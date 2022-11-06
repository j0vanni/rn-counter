import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Card from "../Components/Card.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      info: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.willFocusSubscription = navigation.addListener(
      "focus",
      () => {
        const date = new Date().toISOString().slice(0, 10);

        const getAllKeys = async () => {
          let keys = [];
          let dataHold = [];
          try {
            keys = await AsyncStorage.getAllKeys();
            for (let i = 0; i < keys.length; i++) {
              let data = "";
              try {
                data = await AsyncStorage.getItem(keys[i].toString());
              } catch (e) {}
              data = data.split('"');
              for (let i = 0; i < data.length; i++) {
                if (data[i].length <= 3) {
                  data.splice(i, 1);
                }
              }

              for (let j = 0; j < data.length; j++) {
                if (Date.parse(date) > Date.parse(data[j])) {
                  data.splice(j, 1);
                }
              }
              if (
                data.length <= 1 &&
                data !== undefined &&
                Date.parse(date) > Date.parse(data[0])
              ) {
                await AsyncStorage.removeItem(keys[i].toString());
                keys.splice(i, 1);
              } else {
                await AsyncStorage.setItem(
                  keys[i].toString(),
                  JSON.stringify(data)
                );

                dataHold.push(data);
              }
            }

            this.setState({ cards: keys });
            this.setState({ info: dataHold });
          } catch (e) {}
        };

        getAllKeys();
      },
      []
    );
  }

  componentDidUpdate() {
    const { isFocused } = this.props;
    if (isFocused) {
      this.willFocusSubscription;
    }
  }

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <TouchableOpacity
          style={{
            width: 70,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            left: 140,
            borderColor: "white",
            borderWidth: 1,
          }}
          onPress={() => navigation.navigate("Create")}
        >
          <Text style={{ fontSize: 14, color: "white" }}>new event</Text>
        </TouchableOpacity>
        <ScrollView style={{ top: 10 }}>
          {this.state.cards.map((items, key) => {
            let arr = this.state.info[key];
            if (arr !== undefined) {
              return (
                <Card key={key} fT={items} dT={arr.length} date={arr[0]} />
              );
            }
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  return <HomeScreen navigation={navigation} isFocused={isFocused} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    color: "white",
  },
  logo: {
    backgroundColor: "white",
    left: 100,
  },
});
