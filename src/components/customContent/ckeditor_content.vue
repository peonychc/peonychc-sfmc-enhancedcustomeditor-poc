<template>
  <Ckeditor :editor="editorType" :config="editorConfig" v-model="editorData" @ready="onEditorReady">
  </Ckeditor>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'


import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily'
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Fontcolor from '@ckeditor/ckeditor5-font/src/fontcolor';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace'
import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties'
import Link from '@ckeditor/ckeditor5-link/src/link'
import SDK from 'blocksdk'

import GenAI from '@/components/editorPlugins/genAI/plugin/genAI'
import { HTMLContent } from '@/components/customContent/basic_content/content.ts'


let sdk = null;
let editorDoc = null, editableAreas = null;

const editorType = ref(ClassicEditor)
const editorData = ref('');

const editorConfig = ref({
  plugins: [
    Paragraph,
    Essentials,
    FontFamily,
    FontSize,
    Fontcolor,
    Bold,
    Italic,
    Underline,
    Alignment,
    FindAndReplace,
    ListProperties,
    Link,
    GenAI
  ],
  fontFamily: {
    supportAllValues: true,
    options: [
      "Arial",
      "Georgia",
      "Garamond",
    ]
  },
  fontSize: {
    supportAllValues: true,
    options: [
      10, 11, 12, 13, 14, 15, 16,
      17, 18, 20, 21, 24, 28, 32,
      38, 42, 44, 46, 48
    ]
  },
  fontColor: {
    columns: 6,
    documentColors: 6,
    colors: [
      { color: '#B47E27', label: 'B47E27' },
      { color: '#716C5E', label: '716C5E' },
      { color: '#FEFEFE', label: 'FEFEFE' },
      { color: '#FA5900', label: 'FA5900' },
      { color: '#BCBEC0', label: 'BCBEC0' },
      { color: '#073C4A', label: '073C4A' },
      { color: '#AF290A', label: 'AF290A' },
    ]
  },
  toolbar: [
    'fontFamily',
    'fontSize',
    'fontcolor',
    '|',
    'bold',
    'italic',
    'underline',
    '|',
    'alignment:left',
    'alignment:center',
    'alignment:right',
    'alignment:justify',
    '|',
    'findandreplace',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'undo',
    'redo',
    '|',
    'link',
    'genAI'
  ],
});

function initMCContent(content) {
  const parser = new DOMParser();
  editorDoc = parser.parseFromString(content, 'text/html');
  editableAreas = editorDoc.getElementsByClassName('editable-area');

  Array.from(editableAreas).forEach((element: Element, index: number) => {
    if (element instanceof HTMLElement) {
      element.setAttribute('data-editor-id', index + 1);
    }
  });

  editorData.value = editableAreas[0].innerHTML;
}

function onEditorReady(editor) {
  sdk = new SDK({
    blockEditorWidth: 900,
    tabs: [
      'htmlblock'
    ]
  });
  sdk.getContent(content => {
    if (!content || content.length == 0) {
      content = HTMLContent;
      sdk.setContent(HTMLContent);
    }
    initMCContent(content);
  });
}

watch(editorData, (nv, ov) => {
  if (editableAreas) {
    editableAreas[0].innerHTML = nv;
    sdk.setContent(editorDoc.body.innerHTML);
  }
})



</script>

<style>
.ck-font-size-dropdown .ck-dropdown__panel {
  max-height: 150px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888888 #f0f0f0;
}

.ck-editor__main .ck-editor__editable {
  min-height: 200px;
}
</style>