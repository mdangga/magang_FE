<template>
  <label class="inline-flex items-center relative cursor-pointer" :title="modelValue ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'">
    <input class="peer hidden" type="checkbox" :checked="modelValue" @change="toggleDarkMode" />

    <!-- Toggle Container -->
    <div class="relative w-[64px] h-[30px] bg-neutral-200 peer-checked:bg-neutral-700 rounded-full 
             after:absolute after:content-[''] after:w-[22px] after:h-[22px] 
             after:bg-gradient-to-r from-amber-400 to-yellow-500 
             peer-checked:after:from-indigo-400 peer-checked:after:to-blue-500
             after:rounded-full after:top-[4px] after:left-[4px]
             active:after:w-[26px]
             peer-checked:after:left-[60px] peer-checked:after:translate-x-[-100%]
             shadow-inner duration-300 after:duration-300 after:shadow-md">
    </div>

    <!-- Sun Icon -->
    <svg viewBox="0 0 24 24" class="fill-amber-600 peer-checked:opacity-20 absolute w-3.5 h-3.5 left-[8px] pointer-events-none transition-opacity">
      <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"></path>
    </svg>

    <!-- Moon Icon -->
    <svg viewBox="0 0 24 24" class="fill-white opacity-20 peer-checked:opacity-100 peer-checked:fill-blue-200 absolute w-3.5 h-3.5 right-[8px] pointer-events-none transition-opacity">
      <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Z"></path>
    </svg>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'toggle'])

const toggleDarkMode = () => {
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('toggle', newValue)
}
</script>
