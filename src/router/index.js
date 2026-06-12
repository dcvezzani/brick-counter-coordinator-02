import { createRouter, createWebHistory } from 'vue-router'
import SessionLayout from '@/components/SessionLayout.vue'
import { getSession } from '@/lib/storyboard-session.js'
import HomeView from '@/views/HomeView.vue'
import ListCupsView from '@/views/ListCupsView.vue'
import ListLotsView from '@/views/ListLotsView.vue'
import LotEntryView from '@/views/LotEntryView.vue'
import NewSessionView from '@/views/NewSessionView.vue'
import PartOutImportView from '@/views/PartOutImportView.vue'
import ReconciliationView from '@/views/ReconciliationView.vue'

function sessionGuard(to) {
  const session = getSession(to.params.sessionId)
  if (!session || session.phase === 'closed') {
    return { name: 'home' }
  }
  return true
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/session/new',
      name: 'session-new',
      component: NewSessionView,
    },
    {
      path: '/session/:sessionId',
      component: SessionLayout,
      beforeEnter: sessionGuard,
      children: [
        {
          path: 'import',
          name: 'session-import',
          component: PartOutImportView,
          meta: { hideSessionNav: true },
        },
        {
          path: 'lot',
          name: 'session-lot',
          component: LotEntryView,
        },
        {
          path: 'lots',
          name: 'session-lots',
          component: ListLotsView,
        },
        {
          path: 'cups',
          name: 'session-cups',
          component: ListCupsView,
        },
        {
          path: 'reconciliation',
          name: 'session-reconciliation',
          component: ReconciliationView,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
