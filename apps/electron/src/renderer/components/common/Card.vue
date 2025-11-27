<template>
  <div :class="cardClass">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'medium',
});

const cardClass = computed(() => {
  const base = 'bg-white dark:bg-gray-800 rounded-lg shadow';
  const paddings = {
    none: '',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  };
  return `${base} ${paddings[props.padding]}`;
});
</script>

