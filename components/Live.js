import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native';
import { Icon } from 'expo';
import { purple, white } from '../utils/colors';
import { Location, Permissions } from 'expo';
import { calculateDirection } from '../utils/helpers';

export default class Live extends Component {
  state = {
    coords: null,
    status: null,
    direction: 'North',
    heading: null,
    bounceValue: new Animated.Value(1)
  };
  componentDidMount() {
    Permissions.getAsync(Permissions.LOCATION)
      .then(({ status }) => {
        // console.log('status', status);
        if (status === 'granted') {
          return this.setLocation();
        }

        this.setState({ status });
      })
      .catch(error => {
        console.warn('Error getting Location permission:', error);
        this.setState({ status: 'undetermined' });
      });
  }
  askPermission = () => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === 'granted') {
          return this.setLocation();
        }

        this.setState({ status });
      })
      .catch(error => console.warn('Error asking Location permission:', error));
  };
  setLocation = () => {
    Location.watchHeadingAsync(heading => {
      // console.log('heading', heading);

      const newDirection = calculateDirection(heading.magHeading);
      const { direction, bounceValue } = this.state;

      if (newDirection !== direction) {
        Animated.sequence([
          Animated.timing(bounceValue, { duration: 200, toValue: 1.04 }),
          Animated.spring(bounceValue, { toValue: 1, friction: 4 })
        ]).start();
      }

      this.setState({
        heading,
        direction: newDirection
      });
    });
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 3000,
        distanceInterval: 1
      },
      ({ coords }) => {
        // console.log('coords:', coords);

        this.setState(() => ({
          coords,
          status: 'granted'
        }));
      }
    );
  };
  render() {
    const { status, coords, direction, heading, bounceValue } = this.state;

    if (status === null) {
      return <ActivityIndicator style={{ marginTop: 30 }} />;
    }

    if (status === 'denied') {
      return (
        <View style={styles.center}>
          <Icon.Foundation name="alert" size={50} />
          <Text>
            You denied your location. You can fix this by visiting your settings
            and enabling location services for this app.
          </Text>
          <TouchableOpacity onPress={this.askPermission} style={styles.button}>
            <Text style={styles.buttonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === 'undetermined') {
      return (
        <View style={styles.center}>
          <Icon.Foundation name="alert" size={50} />
          <Text>You need to enable location services for this app.</Text>
          <TouchableOpacity onPress={this.askPermission} style={styles.button}>
            <Text style={styles.buttonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.directionContainer}>
          <Text style={styles.header}>You&apos;re heading</Text>
          <Animated.Text
            style={[styles.direction, { transform: [{ scale: bounceValue }] }]}
          >
            {direction}
          </Animated.Text>
        </View>
        <View>
          <Text>Coords: {JSON.stringify(coords)}</Text>
        </View>
        <View>
          <Text>Heading: {JSON.stringify(heading)}</Text>
        </View>
        <View style={styles.metricContainer}>
          <View style={styles.metric}>
            <Text style={[styles.header, { color: white }]}>Altitude</Text>
            <Text style={[styles.subHeader, { color: white }]}>
              {Math.round(coords.altitude * 3.2888)} Feet
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.header, { color: white }]}>Speed</Text>
            <Text style={[styles.subHeader, { color: white }]}>
              {(coords.speed * 2.2369).toFixed(1)} MPH
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  },
  button: {
    padding: 10,
    backgroundColor: purple,
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20
  },
  buttonText: {
    color: white,
    fontSize: 20
  },
  directionContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    fontSize: 35,
    textAlign: 'center'
  },
  direction: {
    color: purple,
    fontSize: 120,
    textAlign: 'center'
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: purple
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255,255,255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5
  }
});
