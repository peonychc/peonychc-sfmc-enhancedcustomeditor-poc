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
              <label> AI Editor Results</label>
              <FontAwesomeIcon class="custom-vetor" :icon="fas.faQuestion" />
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
import { ref, reactive, defineProps } from 'vue'
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
        if (matches != null) {
          for (let i in matches) {
            // choicesMessages.value[i] = matches[i].match(/(\d+\.\s\*\*)((.)*)\*\*/)[2]
            choicesMessages.value[i] = matches[i].match(/(\d+\.\s)((.)*)/)[2]
          }
        } else {
          isGenerated.value = false;
          ElMessage({
            message: messages,
            type: 'error',
            duration: 5000
          });
        }
        loading.value = false;
      })
    }
  });
}

const confirmAction = () => {
  if (!isGenerated.value) {
    generateAction();
    config.genAIConfig.footer.confirm.value = 'Apply';
  } else {
    let element = props.writer.createText(generateText.value);
    props.model.insertContent(element);

    visible.value = false;
    isGenerated.value = false
    config.genAIConfig.footer.confirm.value = 'Generate';
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
</script>

<style lang="scss" scoped>
.custom-form-item-label {
  display: inline-flex;
  position: relative;
}

.custom-vetor {
  width: 10px;
  height: 10px;
  border: 1px solid #515151;
  border-radius: 50%;
  color: var(--dialog-bg-fill-color);
  background-color: #515151;
  float: right;
  position: absolute;
  top: 5px;
  right: -28px;
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
</style>