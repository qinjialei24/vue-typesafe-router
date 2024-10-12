<template>
  <div>
    <h2>User</h2>
    <button @click="toUserProfile">User Profile pushWithDynamicParamsAndQuery</button>

    <button @click="toUserDetail">User Detail pushWithDynamicParams</button>


    <div>
      <h1> get dynamic params: {{ userRoute.getParams().name }}</h1>
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { userProfileRoute, userRoute } from '../main'
import { useRouter } from 'vue-router'
const router = useRouter()


const toUserProfile = () => {
  userProfileRoute.push({
    query: {
      id: 0,
      name: 'bob'
    },
    params: {
      name: 'bob'
    }
  })
}
const toUserDetail = () => {
  router.push({ path: '/user/bob/detail' })
}


</script>

<style scoped>
/* 你的样式 */
</style>
