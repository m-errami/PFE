import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'
import Formateurs from '@/views/Formateurs.vue'
import Participants from '@/views/Participants.vue'
import Sessions from '@/views/Sessions.vue'
import Modules from '@/views/Modules.vue'
import Seances from '@/views/Seances.vue'
import Paiements from '@/views/Paiements.vue'
import Tranches from '@/views/Tranches.vue'
import Presences from '@/views/Presences.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/formateurs', component: Formateurs },
  { path: '/participants', component: Participants },
  { path: '/sessions', component: Sessions },
  { path: '/modules', component: Modules },
  { path: '/seances', component: Seances },
  { path: '/paiements', component: Paiements },
  { path: '/tranches', component: Tranches },
  { path: '/presences', component: Presences },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
