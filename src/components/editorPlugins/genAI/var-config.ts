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
      },
      {
        label: "DU Hotel (Hospitality demo)",
        value: "A premium Deloitte - themed business hotel. It offers top - notch accommodation, dining, and meeting services, blending Deloitte's professional elements with hospitality. The hotel is designed to provide business travelers with a comfortable and efficient stay, featuring well - appointed rooms, diverse dining options, advanced meeting facilities, leisure amenities, smart systems, and a professional service team."
      },
      {
        label: "Deloitte Apparels (Fashion demo)",
        value: "A professional fashion brand themed on Deloitte, known for its signature Deloitte green color palette. We specialize in green - based professional attire and accessories, blending Deloitte's professional elements with fashion trends. Our focus on quality and innovation ensures that our stylish collections are perfect for the workplace and beyond."
      },
      {
        label: "Deloitte Bank (Banking demo)",
        value: "A forward-thinking Deloitte-themed bank. It offers innovative financial solutions and personalized services, combining Deloitte's professional insights with advanced banking technology. The bank aims to help clients achieve their financial goals with a wide range of products and services, including retail banking, corporate banking, and investment banking."
      }
      ],
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