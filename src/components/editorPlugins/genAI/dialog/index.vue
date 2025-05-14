<template>
  <div>
    <CustomDialog :visible="visible" :config="config.genAIConfig" :cancelFunction="cancelAction"
      :confirmFunction="confirmAction">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
        <el-form-item v-for="item in config.formConfig.items" :key="item.field"
          :prop="item.required ? item.field : undefined">
          <template #label>
            <div class="custom-form-item-label">
              <label v-text="item.label"></label>
              <FontAwesomeIcon class="custom-vetor" :icon="fas.faQuestion" />
            </div>
          </template>
          <el-select v-if="item.type == 'select'" v-model="form[item.field]"
            :placeholder="item.placeholder ? item.placeholder : ''" popper-class="custom-select">
            <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
          <el-input v-else-if="item.type == 'input'" v-model="form[item.field]" :placeholder="item.placeholder" />
          <el-input v-else-if="item.type == 'textarea'" v-model="form[item.field]" :placeholder="item.placeholder"
            :maxlength="item.maxlength" show-word-limit type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" />
        </el-form-item>
        <div class="custom-content" v-if="isGenerated" style="margin-top: 30px; text-align: right;">
          <el-button class="dialog-cancel" @click="cancelAction">
            <span v-text="config.genAIConfig.footer.cancel"></span>
          </el-button>
          <el-button class="dialog-confirm" @click="generateAction">
            <span v-text="config.genAIConfig.generator"></span>
          </el-button>
        </div>
        <el-form-item v-if="isGenerated">
          <template #label>
            <div class="custom-form-item-label">
              <label>AI Editor Results</label>
              <div class="ai-results-actions" v-if="isGenerated && choicesMessages.length > 0">
                <el-button type="default" size="small" class="ai-action-button" @click="regenerateContent">Regenerate</el-button>
                <el-button type="default" size="small" class="ai-action-button" @click="copyContent" :disabled="!generateText">Copy</el-button>
              </div>
              <FontAwesomeIcon class="custom-vetor" :icon="faQuestion" />
            </div>
          </template>
          <div class="custom-text-select" v-loading="loading" style="height: 194px;width: 100%;">
            <span class="custom-text-select-option" v-for="(message, index) in choicesMessages" :key="index"
              v-text="message" @click="handleAIEditor"></span>
          </div>
        </el-form-item>
      </el-form>
    </CustomDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps } from 'vue';
import type { FormInstance, FormRules, ElMessage } from 'element-plus'
import CustomDialog from '@/components/dialog/index.vue';
import config from '../var-config'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas, faQuestion } from '@fortawesome/free-solid-svg-icons'

import { generateEditor } from '@/api/genai_api.ts'


const props = defineProps({
  model: Object,
  writer: Object
})


const visible = ref(true)

const formRef = ref<FormInstance>();
const rules = reactive<FormRules<any>>(config.formConfig.rules);
const form = reactive({})

const isGenerated = ref(false);
const loading = ref(false);
const generateText = ref(null);
const choicesMessages = ref([])

const cancelAction = () => {
  visible.value = false;

}

const generateAction = () => {
  (formRef.value).validate((valid) => {
    if (valid) {
      loading.value = true;
      isGenerated.value = true;
      generateEditor(form).then((res) => {

        let messages = res.choices[0].message.content;
        // let matches = messages.match(/(\d+\.\s\*\*)((?!\\n\\n).)*/g);
        let matches = messages.match(/(\d+\.\s)((?!\\n\\n).)*/g);
        choicesMessages.value = []; // Clear previous messages
        if (matches != null) {
          for (let i in matches) {
            const matchResult = matches[i].match(/(\d+\.\s)(.*)/);
            if (matchResult && matchResult[2]) {
              choicesMessages.value.push(matchResult[2].trim());
            }
          }
        } else {
          isGenerated.value = false;
          ElMessage({
            message: messages,
            type: 'error',
            duration: 5000
          });
        }
      }).catch(err => {
        ElMessage.error('Failed to generate content.');
        console.error('Generation error:', err);
        isGenerated.value = false; // Reset if error
      }).finally(() => {
        loading.value = false;
      });
    }
  });
}

const confirmAction = () => {
  if (!isGenerated.value) {
    generateAction();
    config.genAIConfig.footer.confirm.value = 'Apply';
  } else {
    if (!generateText.value) {
      ElMessage.warning('Please select an AI generated option to apply.');
      return;
    }
    let element = props.writer.createText(generateText.value);
    props.model.insertContent(element);

    visible.value = false;
    // Reset state for next time
    isGenerated.value = false;
    generateText.value = null;
    choicesMessages.value = [];
    config.genAIConfig.footer.confirm.value = 'Generate';
    // formRef.value?.resetFields(); // Optionally reset form fields if needed
  }
}

const handleAIEditor = (e) => {
  let dom = e.target;
  Array.from(dom.parentNode.children).forEach(element => {
    if (element != dom) element.classList.remove('is-selected');
  });

  dom.classList.add('is-selected');
  generateText.value = dom.textContent;

}

const regenerateContent = () => {
  // Clear previous results and selection
  choicesMessages.value = [];
  generateText.value = null;
  // isGenerated.value is likely true, generateAction will manage it and loading state
  generateAction();
}

const copyContent = async () => {
  if (generateText.value) {
    try {
      await navigator.clipboard.writeText(generateText.value);
      ElMessage.success('Content copied to clipboard!');
    } catch (err) {
      ElMessage.error('Failed to copy content.');
      console.error('Failed to copy: ', err);
    }
  } else {
    ElMessage.warning('No content selected to copy.');
  }
}

</script>

<style lang="scss" scoped>
.custom-form-item-label {
  display: inline-flex; // Allows label and actions to sit on the same line like text
  position: relative;
  align-items: center; // Vertically aligns the label text and the action buttons

  .ai-results-actions {
    display: inline-flex; // Ensures buttons are in a row
    gap: 8px; // Space between Regenerate and Copy buttons
    margin-left: 10px; // Space between "AI Editor Results" text and "Regenerate" button

    .ai-action-button {
      padding: 2px 8px; // Smaller padding for a compact button
      font-size: 12px; // Smaller font size
      line-height: 18px; // Adjust line height for content
      min-height: unset; // Remove Element Plus default min-height
      height: auto; // Let padding and line-height determine height

      background-color: #B0B0B0; // Light grey background as per image
      color: #333333;           // Dark text for contrast
      border: 1px solid #A0A0A0; // Slightly darker border
      box-shadow: none; // Remove default shadow if any

      &:hover {
        background-color: #C0C0C0; // Lighter on hover
        border-color: #B0B0B0;
        color: #333333; // Keep text color consistent
      }
      &:active {
        background-color: #A0A0A0; // Darker on active
        border-color: #909090;
        color: #333333; // Keep text color consistent
      }

      // Element Plus uses .is-disabled for disabled state
      &.is-disabled {
        background-color: #707070 !important; // Darker grey for disabled button background
        color: #A0A0A0 !important;            // Lighter text for disabled
        border-color: #606060 !important;
      }
    }
  }
}

.custom-vetor {
  width: 10px;
  height: 10px;
  border: 1px solid #515151;
  border-radius: 50%;
  color: var(--dialog-bg-fill-color);
  background-color: #515151;
  float: right;
  position: absolute; // Keeps icon positioned relative to .custom-form-item-label
  top: 5px; // Original vertical position
  right: -28px; // Original horizontal position (relative to the end of the label container)
}
</style>
<style lang="scss">
.el-textarea,
.custom-text-select {

  /*滚动条整体部分*/
  .el-textarea__inner::-webkit-scrollbar,
  .custom-text-select-option::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  /*滚动条的轨道*/
  .el-textarea__inner::-webkit-scrollbar-track,
  .custom-text-select-option::-webkit-scrollbar-track {
    background-color: #414141;
  }

  /*滚动条里面的小方块，能向上向下移动*/
  .el-textarea__inner::-webkit-scrollbar-thumb,
  .custom-text-select-option::-webkit-scrollbar-thumb {
    background-color: #ACACAC;
    border-radius: 5px;
    border: 1px solid #ACACAC;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }

  .el-textarea__inner::-webkit-scrollbar-thumb:hover,
  .custom-text-select-option::-webkit-scrollbar-thumb:hover {
    background-color: #ACACAC;
  }

  .el-textarea__inner::-webkit-scrollbar-thumb:active,
  .custom-text-select-option::webkit-scrollbar-thumb:active {
    background-color: #ACACAC;
  }

  /*边角，即两个滚动条的交汇处*/
  .el-textarea__inner::-webkit-scrollbar-corner {
    background-color: #414141;
  }
}



.custom-select.el-popper {
  background-color: #515151 !important;
  border: 1px solid var(--dialog-bg-stroke-color);
  color: var(--white-bg-color);

  .el-select-dropdown__list {
    // border-color: #515151;

    .el-select-dropdown__item {
      background-color: #515151;
      color: var(--white-bg-color);
    }

    .el-select-dropdown__item:hover {
      background-color: #515151;
      color: var(--theme-color);
    }
  }

  .el-popper__arrow::before {
    background-color: #515151;
    border: none;
  }

}

.custom-text-select {
  display: flex;
  border: 1px solid var(--dialog-bg-stroke-color);



  .custom-text-select-option {
    height: 150px;
    overflow: auto;
    flex: 1;
    margin: 10px;
    padding: 10px;
    border: 1px solid #3D3D3D;
    border-radius: 5px;
    background-color: #3D3D3D;
    color: var(--white-bg-color);
    font-size: 12px;
  }

  .custom-text-select-option:hover,
  .custom-text-select-option.is-selected {
    border-color: var(--theme-color);
  }
}

.custom-dialog {
  .el-loading-spinner .path {
    stroke: var(--theme-color);
    ;
  }
}

.custom-content {
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

// Additional global styles if needed, or to ensure el-button overrides
.el-button.ai-action-button {
  // Ensure text color is correctly applied, as el-button might have internal spans
  span {
    color: #333333; 
  }

  &:hover span, &:focus span, &:active span {
    color: #333333; // Keep text color dark on interaction
  }

  &.is-disabled span {
    color: #A0A0A0 !important; // Ensure disabled text color is applied
  }
}
</style>