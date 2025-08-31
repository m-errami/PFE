<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <input v-model="q" placeholder="Search..." class="w-80" />
      <div class="space-x-2">
        <button class="btn" @click="refresh">Refresh</button>
        <button v-if="config.create !== null" class="btn btn-primary" @click="openCreate">New</button>
      </div>
    </div>

    <div class="overflow-x-auto border rounded-xl">
      <table>
        <thead>
          <tr>
            <th v-for="col in config.columns" :key="name(col)">{{ label(col) }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paged" :key="item[config.idKey]" class="border-t">
            <td v-for="col in config.columns" :key="name(col)">
              <template v-if="typeof item[name(col)] === 'boolean'">
                <button
                  v-if="config.basePath === '/presence' && name(col)==='present'"
                  class="badge"
                  :class="item[name(col)] ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'"
                  @click="togglePresence(item)">
                  {{ item[name(col)] ? 'Oui' : 'Non' }}
                </button>
                <span v-else class="badge" :class="item[name(col)] ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'">
                  {{ item[name(col)] ? 'Oui' : 'Non' }}
                </span>
              </template>
              <template v-else-if="typeof item[name(col)] === 'object' && item[name(col)] !== null">
                {{ objectLabel(item[name(col)]) }}
              </template>
              <template v-else>
                {{ item[name(col)] }}
              </template>
            </td>
            <td class="space-x-2">
              <button v-if="config.update !== false" class="btn" @click="openEdit(item)">Edit</button>
              <button v-if="config.delete !== false" class="btn btn-danger" @click="del(item)">Delete</button>
            </td>
          </tr>
          <tr v-if="paged.length===0">
            <td :colspan="config.columns.length+1" class="text-center text-slate-400">No rows.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="drawer" class="mt-6 card max-w-3xl">
      <h3 class="text-lg font-semibold mb-3">{{ drawerMode==='create' ? ('Create '+config.titleSingular) : ('Edit '+config.titleSingular) }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="f in config.fields" :key="f.name">
          <label class="block mb-1">{{ f.label || f.name }}</label>

          <!-- Relation dropdowns -->
          <select v-if="isModule && f.name==='sessionId'" v-model.number="form.sessionId">
            <option disabled value="">-- select session --</option>
            <option v-for="s in sessionOptions" :key="s.id" :value="s.id">
              {{ s.id }} — {{ s.intitule || s.nom || 'Session '+s.id }}
            </option>
          </select>

          <select v-else-if="isModule && (f.name==='formateurId' || f.name==='formateur')" v-model.number="form.formateurId">
            <option disabled value="">-- select formateur --</option>
            <option v-for="p in formateurOptions" :key="p.id" :value="p.id">
              {{ p.id }} — {{ p.nom }} {{ p.prenom }}
            </option>
          </select>

          <select v-else-if="isSeance && f.name==='moduleId'" v-model.number="form.moduleId">
            <option disabled value="">-- select module --</option>
            <option v-for="m in moduleOptions" :key="m.id" :value="m.id">
              {{ m.id }} — {{ m.nom }}
            </option>
          </select>

          <select v-else-if="isPaiement && f.name==='participantId'" v-model.number="form.participantId">
            <option disabled value="">-- select participant --</option>
            <option v-for="p in participantOptions" :key="p.id" :value="p.id">
              {{ p.id }} — {{ p.nom }} {{ p.prenom }}
            </option>
          </select>

          <select v-else-if="isPaiement && f.name==='sessionId'" v-model.number="form.sessionId">
            <option disabled value="">-- select session --</option>
            <option v-for="s in sessionOptions" :key="s.id" :value="s.id">
              {{ s.id }} — {{ s.intitule || s.nom || 'Session '+s.id }}
            </option>
          </select>

          <select v-else-if="isTranche && f.name==='paiementId'" v-model.number="form.paiementId">
            <option disabled value="">-- select paiement --</option>
            <option v-for="p in paiementOptions" :key="p.id" :value="p.id">
              {{ p.id }} — {{ money(p.montant) }}
            </option>
          </select>

          <!-- Primitive fields -->
          <input v-else-if="f.type==='string' || !f.type" v-model="form[f.name]" type="text" />
          <input v-else-if="f.type==='number'" v-model.number="form[f.name]" type="number" />
          <input v-else-if="f.type==='date'" v-model="form[f.name]" type="date" />
          <input v-else-if="f.type==='time'" v-model="form[f.name]" type="time" />
          <select v-else-if="f.type==='boolean'" v-model="form[f.name]">
            <option :value="true">Oui</option>
            <option :value="false">Non</option>
          </select>
          <input v-else v-model="form[f.name]" type="text" />
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <button class="btn" @click="closeDrawer">Cancel</button>
        <button class="btn btn-primary" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import http from '@/api/http'

const props = defineProps({ config: { type: Object, required: true } })

const rows = ref([])
const drawer = ref(false)
const drawerMode = ref('create')
const form = ref({})
const q = ref('')
const page = ref(1)
const pageSize = ref(10)

// relation options
const formateurOptions = ref([])
const participantOptions = ref([])
const sessionOptions = ref([])
const moduleOptions = ref([])
const paiementOptions = ref([])

const isModule = computed(()=> props.config.basePath === '/module')
const isSeance = computed(()=> props.config.basePath === '/seance')
const isPaiement = computed(()=> props.config.basePath === '/paiement')
const isTranche = computed(()=> props.config.basePath === '/tranche')

const label = (c) => typeof c === 'string' ? c : (c.label || c.name)
const name = (c) => typeof c === 'string' ? c : (c.name)

function objectLabel(v){ if (!v) return ''; return v.intitule ?? v.nom ?? v.name ?? v.titre ?? v.title ?? v.id }
function money(v){ if (v==null) return ''; return Intl.NumberFormat(undefined,{style:'currency',currency:'MAD'}).format(v) }

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return rows.value
  return rows.value.filter(r => JSON.stringify(r).toLowerCase().includes(s))
})
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function toISODate(val){
  if (val == null) return val
  if (typeof val === 'string' && val.includes('/')){
    const [mm, dd, yyyy] = val.split('/') // some browsers use MM/DD/YYYY
    if (yyyy && dd && mm && mm.length <= 2) return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`
  }
  // or DD/MM/YYYY format
  if (typeof val === 'string' && val.match(/^\d{2}\/\d{2}\/\d{4}$/)){
    const [dd, mm, yyyy] = val.split('/')
    return `${yyyy}-${mm}-${dd}`
  }
  const d = new Date(val)
  if (!isNaN(d.getTime())) return d.toISOString().slice(0,10)
  return val
}

function normalizePayload(basePath, obj){
  const out = { ...obj }
  for (const k in out){
    if (k.toLowerCase().includes('date')) out[k] = toISODate(out[k])
  }
  // Module: backend expects formateur as object {id}
  if (basePath === '/module'){
    const fid = out.formateurId ?? out.formateur
    if (fid != null){
      const idNum = Number(fid)
      if (!Number.isNaN(idNum)){
        out.formateur = { id: idNum }
        delete out.formateurId
      }
    }
  }
  return out
}

const buildCreateUrl = (basePath, f) => {
  if (basePath === '/module' && (f.sessionId || f.session || f.session_id)){
    const sid = f.sessionId || f.session?.id || f.session_id
    return `/module/add/${sid}`
  }
  if (basePath === '/seance' && (f.moduleId || f.module || f.module_id)){
    const mid = f.moduleId || f.module?.id || f.module_id
    return `/seance/add/${mid}`
  }
  if (basePath === '/tranche' && (f.paiementId || f.paiement || f.paiement_id)){
    const pid = f.paiementId || f.paiement?.id || f.paiement_id
    return `/tranche/add/${pid}`
  }
  if (basePath === '/paiement') {
    const pid = encodeURIComponent(f.participantId)
    const sid = encodeURIComponent(f.sessionId)
    const m   = encodeURIComponent(f.montant)
    return `/paiement/add?participantId=${pid}&sessionId=${sid}&montant=${m}`
  }
  return `${basePath}/add`
}

async function refresh(){
  const { data } = await http.get(props.config.basePath + '/all')
  rows.value = data
}

async function loadOptions(){
  if (isModule.value){
    const [fs, ss] = await Promise.all([
      http.get('/formateur/all'),
      http.get('/session/all')
    ])
    formateurOptions.value = fs.data || []
    sessionOptions.value   = ss.data || []
  }
  if (isSeance.value){
    const [ms] = await Promise.all([ http.get('/module/all') ])
    moduleOptions.value = ms.data || []
  }
  if (isPaiement.value){
    const [ps, ss] = await Promise.all([
      http.get('/participant/all'),
      http.get('/session/all')
    ])
    participantOptions.value = ps.data || []
    sessionOptions.value     = ss.data || []
  }
  if (isTranche.value){
    const [pays] = await Promise.all([ http.get('/paiement/all') ])
    paiementOptions.value = pays.data || []
  }
}

function openCreate(){ form.value = {}; drawerMode.value='create'; drawer.value = true }
function openEdit(item){
  form.value = { ...item }
  if (isModule.value){
    form.value.sessionId   = item.sessionId ?? item.session?.id ?? form.value.sessionId
    form.value.formateurId = item.formateurId ?? item.formateur?.id ?? form.value.formateurId
  }
  if (isSeance.value){
    form.value.moduleId = item.moduleId ?? item.module?.id ?? form.value.moduleId
  }
  if (isTranche.value){
    form.value.paiementId = item.paiementId ?? item.paiement?.id ?? form.value.paiementId
  }
  drawerMode.value='edit'; drawer.value = true
}
function closeDrawer(){ drawer.value = false }

async function save(){
  const base = props.config.basePath
  try {
    if (isModule.value){
      if (!form.value.sessionId || !form.value.formateurId){ alert('Select Session and Formateur'); return }
    }
    if (isSeance.value){
      if (!form.value.moduleId){ alert('Select Module'); return }
    }
    if (isPaiement.value){
      if (!form.value.participantId || !form.value.sessionId){ alert('Select Participant and Session'); return }
    }
    if (isTranche.value){
      if (!form.value.paiementId){ alert('Select Paiement'); return }
    }

    if (drawerMode.value === 'create'){
      const url = buildCreateUrl(base, form.value)
      const body = normalizePayload(base, form.value)
      await http.post(url, body)
    } else {
      await http.put(base + '/update', normalizePayload(base, form.value))
    }
    drawer.value = false
    await refresh()
  } catch (err) {
    console.error(err)
    alert(err?.response?.data?.message || ('Save failed (' + (err?.response?.status||'') + ')'))
  }
}

async function del(item){
  try {
    await http.delete(props.config.basePath + '/delete/' + item[props.config.idKey])
    await refresh()
  } catch (err){
    console.error(err)
    alert(err?.response?.data?.message || 'Delete failed')
  }
}

async function togglePresence(row){
  try {
    const body = { id: row.id, present: !row.present }
    await http.put('/presence/update', body)
    row.present = !row.present
  } catch (e) {
    console.error(e)
    alert('Failed to toggle présence')
  }
}

onMounted(async () => {
  await refresh()
  await loadOptions()
})
</script>
