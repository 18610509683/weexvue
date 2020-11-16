<template>
  <food-detail :is-edit="false" />
</template>

<script>
import FoodDetail from './components/FoodDetail'

export default {
  name: 'CreateForm',
  components: { FoodDetail }
}
</script>

