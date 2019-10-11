import { AsyncStorage } from 'react-native';
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from './_calendar';

// export function fetchCalendarResults() {
//   return AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then(formatCalendarResults);
// }

export async function fetchCalendarResults() {
  const storeResults = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
  return formatCalendarResults(storeResults);
}

export function submitEntry({ entry, key }) {
  return AsyncStorage.mergeItem(
    CALENDAR_STORAGE_KEY,
    JSON.stringify({
      [key]: entry
    })
  );
}

// export function removeEntry(key) {
//   return AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then(results => {
//     const data = JSON.parse(results);
//     data[key] = undefined;
//     delete data[key];
//     AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
//   });
// }

export async function removeEntry(key) {
  const results = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
  const data = JSON.parse(results);
  data[key] = undefined;
  delete data[key];
  AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
}
