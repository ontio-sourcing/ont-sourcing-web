import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NewEvidence from '@/components/NewEvidence'
import ReviewEvidence from '@/components/ReviewEvidence'
import Confirm from '@/components/Confirm'
import EvidenceRecord from '@/components/EvidenceRecord'
import DetailEvidence from '@/components/DetailEvidence'
import axios from 'axios'

Vue.use(Router)

const router = new Router({
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

function jumpTo(target, origin, next) {
  if (target.name !== origin.name) {
    return next(target);
  }
  return next();
}

// Route guard judges access_token
router.beforeEach(async (to, from, next) => {

  let toPath = to.name
  if (toPath === 'newEvidence') {
    let result = to.query.result
    if (result) {
      let response = JSON.parse(decodeURIComponent(to.query.result))
      sessionStorage.setItem("ontid", response.ontid);
      sessionStorage.setItem("access_token", response.access_token);
      next()
      return
    }
  } else if (toPath === 'detailEvidence') {
    next()
    return
  }


  let access_token = sessionStorage.getItem("access_token");
  // if no access_token then go web_home
  if (!access_token) {
    sessionStorage.clear()
    jumpTo({ name: 'Home' }, to, next)
    return
  }

  try {
    let res = await axios.post(process.env.API_ROOT + 'api/v1/contract/token/check', {
      access_token
    })
    if (!res.data.result) {
      sessionStorage.clear()
      jumpTo({ name: 'Home' }, to, next)
    } else {
      next()
    }
  } catch (error) {
    sessionStorage.clear()
    jumpTo({ name: 'Home' }, to, next)
    return
  }
})


export default router;