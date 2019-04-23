<template>
    <div class="home">
        <TopBar></TopBar>
        <Top></Top>
    </div>
</template>
<script>
import {API_ROOT} from '../config'
import TopBar from './TopBar'
import Top from './Top'
export default {
    components:{
        TopBar,
        Top
    }
}
</script>
<style scoped>

</style>
