import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import purple from '../utils/colors';

const DateHeader = ({ date }) => {
  return <Text style={styles.dateText}>{date}</Text>;
};

DateHeader.propTypes = {
  date: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: 25,
    color: purple
  }
});

export default DateHeader;
