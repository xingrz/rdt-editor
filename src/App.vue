<template>
  <n-config-provider>
    <div :class="$style.container" :style="{ '--menu-bar-height': '34px' }">
      <app-menu :class="$style.menu" :items="menuItems" />
      <n-split :class="$style.main" direction="horizontal" :resize-trigger-size="8" v-model:size="editorStore.split">
        <template #1>
          <editor v-model:content="editorStore.content" v-model:selection="editorStore.selection"
            v-model:scroll="editorStore.scroll" :icons="iconStore.icons" :size="editorStore.size" />
        </template>
        <template #2>
          <scroller v-model:scroll="editorStore.scroll">
            <BSMap :content="editorStore.content" :size="editorStore.size" />
          </scroller>
        </template>
        <template #resize-trigger>
          <div :class="$style.resizer" />
        </template>
      </n-split>
    </div>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import {
  type DropdownOption,
  NConfigProvider,
  NSplit,
} from 'naive-ui';

import { useEditorStore } from '@/stores/editor';
import { useIconStore } from '@/stores/icon';

import useDomEvented from '@/composables/useDomEvented';

import AppMenu from './components/AppMenu.vue';
import Scroller from './components/Scroller.vue';
import BSMap from './components/BSMap.vue';
import Editor from './components/Editor.vue';

import SizeSetter from './components/AppMenu/SizeSetter.vue';

const editorStore = useEditorStore();
const iconStore = useIconStore();

const isFullscreen = useDomEvented(document, 'fullscreenchange', () => !!document.fullscreenElement);

const menuItems: DropdownOption[] = [
  {
    label: 'View',
    key: 'view',
    children: [
      {
        key: 'icon-size',
        type: 'render',
        render: () => h(SizeSetter),
      },
      { type: 'divider' },
      {
        label: () => isFullscreen.value ? 'Leave fullscreen' : 'Enter fullscreen',
        key: 'fullscreen',
        props: {
          onClick: () => {
            if (isFullscreen.value) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          },
        },
      },
    ],
  },
  {
    label: 'Help',
    key: 'help',
    children: [
      {
        label: () => h('a', {
          href: 'https://github.com/xingrz/rdt-editor/issues/new',
          target: '_blank',
        }, 'Feedback'),
        key: 'feedback',
      },
      {
        label: () => h('a', {
          href: 'https://github.com/xingrz/rdt-editor',
          target: '_blank',
        }, 'About RDT Editor'),
        key: 'about',
      },
    ],
  },
];
</script>

<style lang="scss" module>
:global(html),
:global(body) {
  margin: 0;
  padding: 0;
  overscroll-behavior: none;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.menu {
  height: var(--menu-bar-height);
}

.main {
  height: calc(100vh - var(--menu-bar-height));
}

.resizer {
  height: 100%;
  background: #cccccc;

  transition: background-color 200ms;

  &:hover {
    background: #d5d5d5;
  }

  &:active {
    background: #c0c0c0;
  }
}
</style>
