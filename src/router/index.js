import { createRouter, createWebHistory } from 'vue-router'
import SessionLayout from '@/components/SessionLayout.vue'
import { getEffectiveProfile } from '@/lib/workflow-profile-state.js'
import { ensureStoryboardFixtures, getSession } from '@/lib/storyboard-session.js'
import { workflowGuard } from '@/lib/workflow-guard.js'
import HomeView from '@/views/HomeView.vue'
import ListCupsView from '@/views/ListCupsView.vue'
import ListLotsView from '@/views/ListLotsView.vue'
import LotEntryView from '@/views/LotEntryView.vue'
import MyListView from '@/views/MyListView.vue'
import NewSessionView from '@/views/NewSessionView.vue'
import PartOutImportView from '@/views/PartOutImportView.vue'
import ReconciliationView from '@/views/ReconciliationView.vue'
import SessionWaitView from '@/views/SessionWaitView.vue'

function sessionGuard(to) {
  ensureStoryboardFixtures()
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
      path: '/session/:sessionId/wait',
      name: 'session-wait',
      component: SessionWaitView,
      beforeEnter: sessionGuard,
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
          meta: { hideSessionNav: true, sessionShell: 'import' },
        },
        {
          path: 'lot',
          name: 'session-lot',
          component: LotEntryView,
          meta: { sessionShell: 'worker' },
        },
        {
          path: 'lots',
          name: 'session-lots',
          component: ListLotsView,
          meta: { sessionShell: 'coordinator' },
        },
        {
          path: 'cups',
          name: 'session-cups',
          component: ListCupsView,
          meta: { sessionShell: 'coordinator' },
        },
        {
          path: 'reconciliation',
          name: 'session-reconciliation',
          component: ReconciliationView,
          meta: { sessionShell: 'coordinator' },
        },
        {
          path: 'my-list',
          name: 'session-my-list',
          component: MyListView,
          meta: { sessionShell: 'worker', workerOnly: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const guardResult = workflowGuard(to, getEffectiveProfile())
  if (guardResult !== true) {
    return guardResult
  }
  return true
})

export default router
