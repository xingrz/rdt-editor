import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

interface Size {
  width: number;
  height: number;
}

export default function useClientSize(elementRef: Ref<HTMLElement | undefined>): Ref<Size | undefined> {
  const getSize = (target: HTMLElement | undefined): Size | undefined => target && {
    width: target.clientWidth,
    height: target.clientHeight,
  };

  const size = ref<Size | undefined>(getSize(elementRef.value));

  const observer = new ResizeObserver(() => {
    size.value = getSize(elementRef.value);
  });

  watch(elementRef, () => {
    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  });

  onMounted(() => {
    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  });

  onBeforeUnmount(() => {
    if (elementRef.value) {
      observer.unobserve(elementRef.value);
    }
  });

  return size;
}
