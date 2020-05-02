<template>
  <ContractList :contracts="contracts"/>
</template>
<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
    
import  ContractList from '../components/ContractList.vue'
import {VERDACCIO_URL, PKG_PREFIX} from '../remote'

@Component({
  components: {
    ContractList
  }
})
export default class Home extends Vue {
  private contracts: object[] = [
  ]
  async created() {
    let datas = await fetch(`${VERDACCIO_URL}/-/verdaccio/packages`).then(res => res.json())
    let exists = this.contracts.reduce((res: any, curr: any) => {
      res[curr.contract] = curr
      return res
    }, {});
    datas.forEach((pkg: any) => {
      if (pkg.name.startsWith(PKG_PREFIX)) {
        if (!exists[pkg.name]) {
          this.contracts.push({
            contract: pkg.name,
            name: pkg.name
          })
        }
      }
    });
  }
}

</script>