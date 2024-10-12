<template>
  <div style="border: 1px solid red">
    <h2>User Profile</h2>
    <hr>
    <h2>query: {{ query }}</h2>
    <hr>
    <h2>dynamic params: {{ userProfileRoute.getParams().name }}</h2>
  </div>
</template>

<script setup lang="ts">
import { userProfileRoute } from '../main'
const query = userProfileRoute.getQuery()

</script>