import { Plugin } from '@ckeditor/ckeditor5-core';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Dialog from '@ckeditor/ckeditor5-ui/src/dialog/dialog'
import View from '@ckeditor/ckeditor5-ui/src/view'
import GenAIDialog from '../dialog/index.vue';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';

let dialogApp: any = null;
let dialogContainer: HTMLElement | null = null;



export default class GenAI extends Plugin {
  static get pluginName() {
    return 'GenAI';
  }
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('genAI', (locale) => {
      // The button will be an instance of ButtonView.
      const button = new ButtonView(locale);

      button.set({
        label: 'GenAI',
        tooltip: true,
        withText: true
      });


      button.on('execute', () => {
        editor.model.change(writer => {
          this.showCustomDialog(editor.model, writer);
        });
      });

      return button;
    });
  }
  showCustomDialog(model, writer) {
    if (!dialogContainer) {
      dialogContainer = document.createElement('div');
      document.body.appendChild(dialogContainer);
    }
    if (!dialogApp) {
      dialogApp = createApp(GenAIDialog, { model, writer });
      dialogApp.mount(dialogContainer);
    } else {
      dialogApp.unmount();
      dialogApp = createApp(GenAIDialog, { model, writer });
      dialogApp.mount(dialogContainer);
    }
  }
}