<template>
  <div :class="$style.menuBar">
    <n-dropdown v-for="item in props.items" :key="item.key" :class="$style.dropdown" :options="item.children"
      placement="bottom-start" :show="showingItem == item.key" @select="handleSelect"
      @clickoutside="handleClickOutside">
      <n-button quaternary :ref="(el) => bindMenuButton(item.key as string, el as ComponentPublicInstance | null)"
        @mouseenter="(e) => handleMouseEnter(e, item.key as string)" @click="(e) => handleClick(e, item.key as string)">
        {{ item.label }}
      </n-button>
    </n-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, type ComponentPublicInstance } from 'vue';
import {
  type DropdownOption,
  NButton,
  NDropdown,
} from 'naive-ui';

const props = defineProps<{
  items: DropdownOption[];
}>();

const showingItem = ref<string | null>(null);
const menuButtons: Record<string, HTMLElement> = {};

function bindMenuButton(key: string, el: ComponentPublicInstance | null): void {
  if (el) {
    menuButtons[key] = el.$el;
  } else {
    delete menuButtons[key];
  }
}

function handleClick(_e: MouseEvent, key: string): void {
  if (showingItem.value == null) {
    showingItem.value = key;
  } else {
    showingItem.value = null;
  }
}

function handleMouseEnter(_e: MouseEvent, key: string): void {
  if (showingItem.value != null) {
    menuButtons[showingItem.value]?.blur();
    showingItem.value = key;
    menuButtons[showingItem.value]?.focus();
  }
}

function handleSelect(): void {
  showingItem.value = null;
}

function handleClickOutside(e: MouseEvent): void {
  if (showingItem.value && menuButtons[showingItem.value]?.contains(e.target as Node)) {
    return;
  }
  showingItem.value = null;
}
</script>

<style lang="scss" module>
.menuBar {
  display: flex;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}

.dropdown {
  min-width: 200px;
}
</style>
