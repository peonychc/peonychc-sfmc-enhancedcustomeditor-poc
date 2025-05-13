import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { Plugin } from '@ckeditor/ckeditor5-core';
export default class Timestamp extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('timestamp', () => {
      // The button will be an instance of ButtonView.
      const button = new ButtonView();

      button.set({
        label: 'Time',
        tooltip: '插入时间戳',
        icon: '<svg t="1715062605726" class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5479"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 85.333334C323.477333 170.666667 170.666667 323.477333 170.666667 512s152.810667 341.333333 341.333333 341.333333 341.333333-152.810667 341.333333-341.333333S700.522667 170.666667 512 170.666667z m0 106.666666a21.333333 21.333333 0 0 1 21.333333 21.333334v234.666666h170.666667a21.333333 21.333333 0 0 1 21.333333 21.333334v42.666666a21.333333 21.333333 0 0 1-21.333333 21.333334H469.333333a21.333333 21.333333 0 0 1-21.333333-21.333334V298.666667a21.333333 21.333333 0 0 1 21.333333-21.333334h42.666667z" fill="#222429" p-id="5480"></path></svg>'
      });


      button.on('execute', () => {
        const now = new Date();

        // Change the model using the model writer.
        editor.model.change(writer => {
          // Insert the text at the user's current position.
          editor.model.insertContent(writer.createText(now.toString()));
        });
      });

      return button;
    });
  }
}