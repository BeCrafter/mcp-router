<template>
  <select
    :name="name"
    :value="modelValue"
    :disabled="disabled"
    :class="selectClass"
    @change="handleChange"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Option {
  value: string;
  label: string;
}

interface Props {
  name?: string;
  modelValue: string;
  options: Option[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
}>();

const handleChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  emit('update:modelValue', value);
  emit('change', value);
};

const selectClass = computed(() => {
  const base = 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500';
  const disabled = props.disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  return `${base} ${disabled}`;
});
</script>

