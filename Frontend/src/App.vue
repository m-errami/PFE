<template>
  <div class="sidebar">
    <h1>SGF Admin</h1>
    <div class="nav">
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/formateurs">Formateurs</RouterLink>
      <RouterLink to="/participants">Participants</RouterLink>
      <RouterLink to="/sessions">Sessions</RouterLink>
      <RouterLink to="/modules">Modules</RouterLink>
      <RouterLink to="/seances">Séances</RouterLink>
      <RouterLink to="/paiements">Paiements</RouterLink>
      <RouterLink to="/tranches">Tranches</RouterLink>
      <RouterLink to="/presences">Présences</RouterLink>
    </div>
  </div>
  <div class="content">
    <RouterView />
  </div>
</template>

<script setup>
</script>
