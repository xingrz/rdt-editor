import { type WatchSource, type WatchStopHandle, watch } from 'vue';

export default function onRefUnassigned<T>(value: WatchSource<T | undefined>, callback: (oldValue: T) => void): WatchStopHandle {
  return watch(value, (newValue, oldValue) => {
    if (typeof newValue == 'undefined' && typeof oldValue != 'undefined') {
      callback(oldValue);
    }
  });
}
