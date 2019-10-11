import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { white } from '../utils/colors';
import MetricCard from '../components/MetricCard';
import { addEntry } from '../actions/index';
import { removeEntry } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import TextButton from '../components/TextButton';

export class EntryDetail extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    metrics: PropTypes.object,
    entryId: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  };
  static navigationOptions = ({ navigation }) => {
    const entryId = navigation.getParam('entryId', 'No Id');

    const year = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day = entryId.slice(8);

    return {
      title: `${month}/${day}/${year}`
    };
  };
  reset = () => {
    const { remove, goBack, entryId } = this.props;

    remove();
    goBack();
    removeEntry(entryId);
  };
  shouldComponentUpdate(nextProps) {
    return nextProps.metrics !== null && !nextProps.metrics.today;
  }
  render() {
    const { metrics, entryId } = this.props;

    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        <TextButton onPress={this.reset} style={{ margin: 20 }}>
          RESET
        </TextButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15
  }
});

const mapStateToProps = (state, { navigation }) => {
  const entryId = navigation.getParam('entryId', 'No Id');

  return {
    entryId,
    metrics: state[entryId]
  };
};

// const mapDispatchToProps = {};
const mapDispatchToProps = (dispatch, { navigation }) => {
  const entryId = navigation.getParam('entryId');

  return {
    remove: () =>
      dispatch(
        addEntry({
          [entryId]: timeToString === entryId ? getDailyReminderValue() : null
        })
      ),
    goBack: () => navigation.goBack()
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryDetail);
