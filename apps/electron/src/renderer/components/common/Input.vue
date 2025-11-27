<template>
  <input
    :type="type"
    :name="name"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="inputClass"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: string;
  name?: string;
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputClass = computed(() => {
  const base = 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500';
  const disabled = props.disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  return `${base} ${disabled}`;
});
</script>

