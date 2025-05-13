import { ref } from 'vue';
import logoImage from '@/assets/images/Logo.png'

const genAIConfig = {
  header: {
    txt: 'Content Generator',
    img: logoImage
  },
  generator: 'Generate',
  footer: {
    cancel: 'Cancel',
    confirm: ref('Generate')
  }
};
const formConfig = {
  items: [
    {
      field: "Brand_Voice",
      label: "Select Your Brand Voice",
      type: "select",
      options: [{
        label: "Deloitte Digital",
        value: "Deloitte Digital"
      }],
      required: true
    },
    {
      field: "Topic",
      label: "Input Your Topic",
      type: "textarea",
      maxlength: 200,
      required: true
    },
    {
      field: "Desired_Sample_Format",
      label: "Input Your Desired Sample Format",
      type: "textarea",
      maxlength: 500,
      required: true
    }
  ],
  rules: {
    Brand_Voice: [
      { required: true, message: 'Please select your Brand Voice', trigger: 'change' }
    ],
    Topic: [
      { required: true, message: 'Please input your Topic', trigger: 'blur' }
    ],
    Desired_Sample_Format: [
      { required: true, message: 'Please input your Desired sample format', trigger: 'blur' },
    ]
  }
};

export default {
  genAIConfig,
  formConfig
};