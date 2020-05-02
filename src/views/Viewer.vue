<template>
  <div class="contract-viewer">
    <ContractView
      @compare="compare"
      :contract="contract"
      :versions="versions"
      v-on:changeVersion="changeVersion"
    ></ContractView>
    <div class="compare-viewer" v-show="compareView">
      <div class="diff-toobar">
        <span :style="{ margin: '5px' }" v-if="info"
          >{{ info.contract }}({{ info.version }}-{{
            info.compareVersion
          }})</span
        >
        <button :style="{ margin: '5px' }" @click="compareView = false">
          关闭
        </button>
      </div>
      <div class="diff-viewer">
        <code-diff
          :old-string="rightJson"
          :new-string="leftJson"
          :context="10"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TContract } from "savml";
import { Component, Provide, Vue } from "vue-property-decorator";
import { getFactory } from "../factory";
import ContractView from "../components/ContractView.vue";
import CodeDiff from "../components/CodeDiff.vue";
import { VERDACCIO_URL } from "../remote";

Component.registerHooks(["beforeRouteUpdate"]);
@Component({
  components: {
    ContractView,
    CodeDiff
  }
})
export default class Viewer extends Vue {
  private compareView: boolean = false;
  private diffHtml: string = "";
  private leftJson: string = "";
  private rightJson: string = "";
  private diffNum: number = 10;
  private info: any = null;
  async created() {
    let { contract, version } = this.$route.params;
    getFactory()
      .getContextFactory()
      .context(contract, version || "latest")
      .then(res => {
        this.contract = res.contract();
      });
    await this.fetchVersions(contract);
  }
  beforeRouteUpdate(to: any, from: any, next: any) {
    let toParams = to.params;
    let fromParams = from.params;
    next();
    if (toParams.contract !== fromParams.contract) {
      this.fetchVersions(toParams.contract);
    }
    if (toParams.version !== fromParams.version) {
      this.fetchContract(toParams.contract, toParams.version);
    }
  }
  async fetchVersions(contract: string) {
    let versions = await fetch(`${VERDACCIO_URL}/${contract}`)
      .then(res => res.json())
      .then(res => Object.keys(res.versions));
    this.versions = versions;
  }
  async fetchContract(contract: string, version: any) {
    getFactory()
      .getContextFactory()
      .context(contract, version || "latest")
      .then(res => {
        this.contract = res.contract();
      });
  }
  private versions: string[] = [];
  changeVersion(params: any) {
    this.$router.push({
      name: "viewer",
      params
    });
  }
  async compare(info: {
    contract: string;
    version: string;
    compareVersion: string;
  }) {
    if (info.version === info.compareVersion) {
      return;
    }
    if (!info.compareVersion) {
      return;
    }
    this.info = info;
    let ctx = await getFactory()
      .getContextFactory()
      .context(info.contract, info.compareVersion)
      .then(res => {
        return res.contract();
      });
    let left = this.contract;
    let right = ctx;
    this.leftJson = JSON.stringify(left, null, 2);
    this.rightJson = JSON.stringify(right, null, 2);
    this.compareView = true;
  }
  @Provide() private contract: TContract = (null as unknown) as TContract;
}
</script>
<style lang="scss">
.compare-viewer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
}
.diff-viewer {
  overflow: auto;
  padding: 5px;
}
.diff-toobar {
  margin: 0 auto;
  padding: 10px;
}
</style>
