import { type UnwrapRef, onBeforeUnmount, onMounted, ref } from 'vue';

export default function useDomEvented<T>(target: EventTarget, type: string, getter: () => T) {
  const value = ref<T>(getter());

  const listener = () => {
    value.value = getter() as UnwrapRef<T>;
  };

  onMounted(() => {
    target.addEventListener(type, listener);
  });

  onBeforeUnmount(() => {
    target.removeEventListener(type, listener);
  });

  return value;
}
