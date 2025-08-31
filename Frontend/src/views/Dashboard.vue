<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="card">
      <h2>Sessions (total)</h2>
      <p style="font-size:40px">{{ counts.sessions }}</p>
    </div>
    <div class="card">
      <h2>Participants</h2>
      <p style="font-size:40px">{{ counts.participants }}</p>
    </div>
    <div class="card">
      <h2>Présences (enregistrées)</h2>
      <p style="font-size:40px">{{ counts.presences }}</p>
    </div>
    <div class="card">
      <h2>Paiements (nb)</h2>
      <p style="font-size:40px">{{ counts.paiements }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/api/http'

const counts = ref({ sessions: 0, participants: 0, presences: 0, paiements: 0 })

onMounted(async () => {
  const [s, p, pr, pa] = await Promise.all([
    http.get('/session/all'), http.get('/participant/all'),
    http.get('/presence/all'), http.get('/paiement/all').catch(()=>({data:[]}))
  ])
  counts.value.sessions = s.data?.length || 0
  counts.value.participants = p.data?.length || 0
  counts.value.presences = pr.data?.length || 0
  counts.value.paiements = pa.data?.length || 0
})
</script>
