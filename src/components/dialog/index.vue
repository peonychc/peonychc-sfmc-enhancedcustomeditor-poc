<template>
  <el-dialog v-model="dialogVisible" width="589" :before-close="handleClose" class="custom-dialog">
    <template #header>
      <div class="dialog-header">
        <span v-text="config.header.txt"></span>
        <img v-if="config.header.img" :src="config.header.img">
      </div>
    </template>
    <div>
      <slot></slot>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="dialog-cancel" @click="cancelAction">
          <span v-text="config.footer.cancel"></span>
        </el-button>
        <el-button class="dialog-confirm" @click="confirmAction">
          <span v-text="config.footer.confirm"></span>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  },
  cancelFunction: Function,
  confirmFunction: Function
})

const dialogVisible = ref(props.visible)

const handleClose = () => {
  dialogVisible.value = false
}

watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue;
});

const cancelAction = () => {
  if (props.cancelFunction) {
    props.cancelFunction();
  } else {
    dialogVisible.value = false
  }
}

const confirmAction = () => {
  if (props.confirmFunction) {
    props.confirmFunction();
  } else {
    dialogVisible.value = false
  }
}

</script>

<style scoped lang="scss">
.dialog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

.dialog-footer {
  button {
    color: var(--dialog-font-color);
  }
  button.dialog-cancel {
    background-color: var(--dialog-bg-stroke-color);
    border-color: var(--dialog-bg-stroke-color);
  }

  button.dialog-confirm {
    background-color: var(--theme-color);
    border-color: var(--theme-color);
  }

  button.dialog-confirm:hover {
    background-color: var(--white-bg-color) !important;
  }
}
</style>