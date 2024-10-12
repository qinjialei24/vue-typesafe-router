<script setup lang="ts">
import {aboutRoute, homeRoute, userProfileRoute, userRoute,} from "../main";

const query = homeRoute.getQuery()

function getQueryData() {
  const query = homeRoute.getQuery()
}

function toUserProfile() {
  userProfileRoute.push({
    query: {id: 0, name: "bryant"},
    params:{name: 'bob'}
  });
}

function toUser() {
  userRoute.push({params:{ name: 'alice' }})
}

</script>

<template>
  <main>
    <h1>this is query data from type router navigation</h1>
    {{ query }}
    <button @click="aboutRoute.push({
      query: {
        id: 1,
        name: 'bob'
      }
    })">go to about view</button>

    <button @click="toUserProfile"> to user profile</button>
    <button @click="toUser"> to user pushWithDynamicParams</button>
  </main>
</template>
