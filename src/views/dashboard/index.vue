<template>
  <div class="dashboard-container">
    <img class="logo-img" src="@/assets/logo2.jpeg" alt="">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px; 
    text-align: center;
    .logo-img{
      margin: 15% 0;
    }

  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
