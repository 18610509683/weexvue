<template>
  <food-detail :is-edit="true" />
</template>

<script>
import FoodDetail from './components/FoodDetail'

export default {
  name: 'EditForm',
  components: { FoodDetail }
}
</script>

