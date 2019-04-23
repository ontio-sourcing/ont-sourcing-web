import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NewEvidence from '@/components/NewEvidence'
import ReviewEvidence from '@/components/ReviewEvidence'
import Confirm from '@/components/Confirm'
import EvidenceRecord from '@/components/EvidenceRecord'
import DetailEvidence from '@/components/DetailEvidence'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/newEvidence',
      name: 'newEvidence',
      component: NewEvidence
    },
    {
      path: '/reviewEvidence',
      name: 'reviewEvidence',
      component: ReviewEvidence
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: Confirm
    },
    {
      path: '/evidenceRecord',
      name: 'evidenceRecord',
      component: EvidenceRecord
    },
    {
      path: '/detailEvidence/:id',
      name: 'detailEvidence',
      component: DetailEvidence
    }
  ]
})
