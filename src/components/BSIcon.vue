<template>
  <div
    class="bs-label"
    v-if="label"
    v-bind:data-overlay="index > 0"
    v-bind:data-bold="label.params.b || label.params.bold"
    v-bind:data-align="(label.params.align || '').toUpperCase()"
    v-bind:style="{
      width: `${size * ratio}px`,
      height: `${size}px`,
      fontSize: `${size - 8}px`,
    }"
  >
    <span>{{ label.text }}</span>
  </div>
  <img
    class="bs-icon"
    v-else
    v-bind:data-overlay="index > 0"
    v-bind:style="{
      width: `${size * ratio}px`,
      height: `${size}px`,
    }"
    v-bind:src="icon ? icon.data : null"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";

import qs from "querystring";

import { RootState } from "@/store/types";
import IIcon from "@/types/icon";

function selectTextWidth(flag: string): number | undefined {
  switch (flag) {
    case "o":
      return 0.125;
    case "c":
      return 0.25;
    case "d":
      return 0.5;
    case "b":
      return 2;
    case "s":
      return 4;
    case "w":
      return 8;
  }
}

function parseTextParams(str: string): Record<string, string> {
  return qs.parse(str, ",", "=", {
    decodeURIComponent: (s) => s,
  }) as Record<string, string>;
}

@Component
export default class BSIcon extends Vue {
  @Prop(String) content!: string;
  @Prop(Number) size!: number;
  @Prop(Number) index!: number;

  @State(({ icon }: RootState) => icon.icons)
  icons!: Record<string, IIcon | null>;

  @Action("fetch") fetch!: (name: string) => Promise<void>;

  @Watch("content") onContentChanged(content: string): void {
    if (!this.label) {
      this.fetch(content);
    }
  }

  @Watch("ratio") onRatioChanged(ratio: number): void {
    this.$emit("ratio", ratio);
  }

  get icon(): IIcon | null {
    return this.icons[this.content];
  }

  get label(): {
    text: string;
    ratio: number;
    params: Record<string, string>;
  } | null {
    if (this.content && this.content.match(/^(.*)\*([^_]+)(__(.+)$)?/)) {
      const ratio = selectTextWidth(RegExp.$1) as number;
      const text = RegExp.$2;
      const params = parseTextParams(RegExp.$4 || "");
      return { text, ratio, params };
    } else {
      return null;
    }
  }

  get ratio(): number {
    if (!this.content) return 1;
    if (this.label) {
      return this.label.ratio || 1;
    } else {
      return this.icon?.ratio || 1;
    }
  }

  created(): void {
    if (this.content && !this.label) {
      this.fetch(this.content);
    }
    this.$emit("ratio", this.ratio);
  }
}
</script>

<style>
.bs-icon,
.bs-label {
  position: absolute;
  user-select: none;
}

.bs-label {
  font-family: monospace;
  text-align: center;
}

.bs-icon[data-overlay],
.bs-label[data-overlay] {
  z-index: 1;
}

.bs-label span {
  line-height: 0.75;
}

.bs-label[data-align="L"] {
  text-align: left;
}

.bs-label[data-align="R"] {
  text-align: right;
}

.bs-label[data-align="A"] span {
  vertical-align: top;
}

.bs-label[data-align="E"] span {
  vertical-align: bottom;
}

.bs-label[data-bold="1"] {
  font-weight: bold;
}
</style>
