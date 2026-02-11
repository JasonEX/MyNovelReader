<template>
  <Transition name="mnr-toast">
    <div
      v-if="visible"
      class="mnr-toast"
      :class="{ 'mnr-toast--error': type === 'error' }"
      :role="type === 'error' ? 'alert' : 'status'"
      @click="$emit('dismiss')"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string;
    type?: 'info' | 'error';
    visible: boolean;
  }>(),
  { type: 'info' }
);

defineEmits<{
  dismiss: [];
}>();
</script>

<style scoped>
.mnr-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  z-index: 1001;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 90vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mnr-toast--error {
  background: rgba(211, 47, 47, 0.95);
}

.mnr-toast-enter-active,
.mnr-toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mnr-toast-enter-from,
.mnr-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(40px) scale(0.9);
}
</style>
