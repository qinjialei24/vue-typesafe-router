<script setup lang="tsx">
import { RouterLink, RouterView } from 'vue-router'

const xxx =()=>{
  return <div>xxx</div>
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/user/bob">User</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
