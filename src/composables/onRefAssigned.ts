import { type WatchSource, type WatchStopHandle, watch } from 'vue';

export default function onRefAssigned<T>(value: WatchSource<T | undefined>, callback: (newValue: T) => void): WatchStopHandle {
  return watch(value, (newValue, oldValue) => {
    if (typeof newValue != 'undefined' && typeof oldValue == 'undefined') {
      callback(newValue);
    }
  });
}
