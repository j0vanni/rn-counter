import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

class Card extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Edit", { itemName: this.props.fT })}
      >
        <Text style={styles.dayText}>{this.props.dT} days</Text>
        <Text style={styles.forText}>for {this.props.fT}</Text>
        <Text style={styles.next}>next date:</Text>
        <Text style={styles.date}>{this.props.date}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 3,
    borderColor: "white",
    borderStyle: "solid",
    width: 400,
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },
  dayText: {
    color: "white",
    left: 30,
    top: 20,
    fontSize: 60,
    fontWeight: "bold",
  },
  forText: {
    color: "white",
    left: 60,
    top: 24,
    fontSize: 30,
  },
  next: {
    color: "white",
    left: 290,
    top: 10,
    fontSize: 20,
  },
  date: {
    color: "white",
    left: 294,
    top: 10,
  },
});

export default function (props) {
  const navigation = useNavigation();
  return (
    <Card
      navigation={navigation}
      dT={props.dT}
      fT={props.fT}
      date={props.date}
    />
  );
}
