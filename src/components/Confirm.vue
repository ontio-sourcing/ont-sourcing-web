<template>
  <div class="confirm">
    <TopBar></TopBar>
    <div class="confirmCon">
      <div class="waitCon" v-if="wait">
        <img style="width:6rem;" src="../assets/img/wait.png" alt>
        <p class="desc">请耐心等待...</p>
      </div>
      <div class="doneCon" v-else>
        <img style="width:6rem;" src="../assets/img/done.png" alt>
        <p class="desc">存证成功！</p>
      </div>
      <div class="bottom">
        <el-button type="primary" round class="back" @click="toNewCunzheng">新建存证</el-button>
        <el-button type="primary" round class="confirm" @click="toCunzhengList">存证记录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import TopBar from './TopBar'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      wait: true,//等待状态
    }
  },
  mounted() {//监听是否上传存证成功
    setTimeout(() => {
      this.wait = false;
    }, 3000);
  },
  methods: {
    toNewCunzheng() {
      this.$router.push({ name: 'newEvidence' });
    },
    toCunzhengList() {
      this.$router.push({ name: 'evidenceRecord' });
    }
  }
}
</script>
<style scoped>
.confirmCon {
  width: 80%;
  margin: 0 auto;
  margin-top: 2rem;
  background: #fff;
  padding: 10rem 0 2rem 0;
  height: 40rem;
  text-align: center;
}
.desc {
  font-size: 1.5rem;
  margin: 5rem 0;
}
.bottom {
  margin-top: 2rem;
  text-align: center;
  width: 100%;
}
.back {
  margin-right: 5%;
  background: unset;
  color: #409eff;
  border-color: #409eff;
  width: unset !important;
}
</style>


