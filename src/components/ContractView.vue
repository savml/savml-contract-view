<template>
  <div class="contract-view" v-if="!!contract">
    <div class="contract-nav" v-show="!hideNav">
      <!-- 合约部分 -->
      <ul class="menu-root">
        <!-- 信息 -->
        <li><h3 class="nav-title">包信息</h3></li>
        <dl class="kv-item">
          <dt>包名</dt>
          <dd>{{ contract.package }}</dd>
        </dl>
        <dl class="kv-item">
          <dt>版本</dt>
          <dd>
            <select v-model="contract.version" @change="changeVersion($event)">
              <option
                :value="version"
                v-for="(version, id) in versions"
                :key="id"
                >{{ version }}</option
              >
            </select>
            -
            <select v-model="compareVersion">
              <option
                :value="version"
                v-for="(version, id) in versions"
                :key="id"
                >{{ version }}</option
              >
            </select>
            =
            <button @click="compare">比较</button>
          </dd>
        </dl>
        <dl class="kv-item">
          <dt>标题</dt>
          <dd>{{ contract.title }}</dd>
        </dl>
        <!-- 包依赖 -->
        <li v-if="contract.dependencies.length">
          <h3 class="nav-title">
            包依赖 <i>({{ contract.dependencies.length }})</i>
          </h3>
        </li>
        <ul class="menu-sub">
          <template v-for="item in contract.dependencies">
            <li :key="item.package" class="menu-item">
              <a
                v-bind:href="'/' + item.package + '/' + item.version"
                class="sidebar-link"
              >
                {{ item.package }}.{{ item.version }}
              </a>
            </li>
          </template>
        </ul>
        <!-- 服务 -->
        <li v-if="contract.services.length">
          <h3 class="nav-title">
            服务列表 <i>({{ contract.services.length }})</i>
          </h3>
        </li>
        <ul class="menu-sub">
          <template v-for="item in contract.services">
            <li :key="item.name" class="menu-item">
              <a
                v-bind:href="'#services.' + item.name"
                class="sidebar-link"
                v-bind:title="item.description || item.title || item.name"
              >
                {{ item.name }}
                <i v-if="sidebarShowTitle && item.title">{{ item.title }}</i>
                <i class="menu-badge">({{ item.actions.length }})</i>
              </a>
              <ul class="menu-sub">
                <template v-for="subitem in item.actions">
                  <li :key="subitem.name" class="menu-item">
                    <a
                      v-bind:href="
                        '#services.' + item.name + '.' + subitem.name
                      "
                      class="sidebar-link"
                      v-bind:title="
                        subitem.description || subitem.title || subitem.name
                      "
                    >
                      {{ subitem.name }}
                      <i v-if="sidebarShowTitle && subitem.title">{{
                        subitem.title
                      }}</i>
                    </a>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ul>
        <!-- 结构 -->
        <li v-if="contract.structs.length">
          <h3 class="nav-title">
            数据结构 <i>({{ contract.structs.length }})</i>
          </h3>
        </li>
        <ul class="menu-sub">
          <template v-for="item in contract.structs">
            <li :key="item.name" class="menu-item">
              <a
                v-bind:href="'#structs.' + item.name"
                class="sidebar-link"
                v-bind:title="item.description || item.title || item.name"
              >
                {{ item.name }}
                <i v-if="sidebarShowTitle && item.title">{{ item.title }}</i>
              </a>
            </li>
          </template>
        </ul>
        <!-- 视图 -->
        <li v-if="contract.pages.length">
          <h3 class="nav-title">
            页面视图 <i>({{ contract.pages.length }})</i>
          </h3>
        </li>
        <ul class="menu-sub">
          <template v-for="item in contract.pages">
            <li :key="item.name" class="menu-item">
              <a
                class="sidebar-link"
                v-bind:title="item.description || item.title || item.name"
              >
                {{ item.name }}
                <i v-if="sidebarShowTitle && item.title">{{ item.title }}</i>
                <i class="menu-badge">({{ item.views.length }})</i>
              </a>
              <ul class="menu-sub">
                <template v-for="subitem in item.views">
                  <li :key="subitem.name" class="menu-item">
                    <a
                      class="sidebar-link"
                      v-bind:title="
                        subitem.description || subitem.title || subitem.name
                      "
                    >
                      {{ subitem.name }}
                      <i v-if="sidebarShowTitle && subitem.title">{{
                        subitem.title
                      }}</i>
                    </a>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ul>
        <!-- 错误代码 -->
        <li v-if="codes.length">
          <h3 class="nav-title">
            错误代码 <i>({{ codes.length }})</i>
          </h3>
        </li>
        <ul class="menu-sub">
          <template v-for="item in codes">
            <li :key="item.code" class="menu-item">
              <a
                v-bind:href="'#codes.' + item.code"
                class="sidebar-link"
                v-bind:title="item.cn || item.en"
              >
                {{ item.code }}
              </a>
            </li>
          </template>
        </ul>
      </ul>
    </div>
    <div class="contract-content">
      <div>
        <router-link style="width: 30px;
    height: 30px;
    display: inline-block;
    text-align: center;
    border: 1px solid gray;
    border-color: rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186);
    border-radius: 20px;" to="/">🏠</router-link>
        <button
          style="margin-left: 10px; width: 32px; height: 32px; border-radius: 50px;"
          @click="hideNav = !hideNav"
          title="显示隐藏侧边栏"
          >
            {{ hideNav ? "&gt;" : "&lt;" }}
          </button>
        <button
          style="position: fixed;
      bottom: 100px;
      right: 50px;
      font-size: 36px;
      background: transparent;
      border: 0;"
          @click="scrollTop"
        >
          ⬆️
        </button>
      </div>
      <!-- 服务列表 -->
      <section class="section-item" v-if="contract.services.length">
        <h3 class="section-title">服务列表</h3>
        <template v-for="service in contract.services">
          <section
            class="section-detail"
            :key="service.name"
            v-bind:id="'services.' + service.name"
          >
            <h4 class="section-title">
              {{ service.name
              }}<span
                class="hash-link"
                @click="toHash('#services.' + service.name)"
                >#</span
              >
            </h4>
            <dl class="kv-item">
              <dt>标题</dt>
              <dd>{{ service.title }}</dd>
            </dl>
            <dl class="kv-item">
              <dt>描述</dt>
              <dd>{{ service.description }}</dd>
            </dl>
            <dl class="kv-item">
              <dt>接口</dt>
              <dd>
                <table class="table">
                  <tr>
                    <th>名称</th>
                    <th>方法</th>
                    <th>路径</th>
                    <th>输入</th>
                    <th>输出</th>
                    <th>标题</th>
                    <th>错误代码</th>
                  </tr>
                  <tr v-for="action in service.actions" :key="action.name">
                    <td
                      v-bind:id="'services.' + service.name + '.' + action.name"
                    >
                      {{ action.name }}
                    </td>
                    <td>{{ action.method || "POST" }}</td>
                    <td>{{ getActionPath(action, service) }}</td>
                    <td>
                      <a
                        v-bind:href="'#structs.' + action.request"
                        v-if="action.request"
                        >{{ action.request }}</a
                      >
                    </td>
                    <td>
                      <a
                        v-bind:href="'#structs.' + action.response"
                        v-if="action.response"
                        >{{ action.response }}</a
                      >
                    </td>
                    <td>{{ action.title }}</td>
                    <td>
                      <div v-for="code in action.codes || []" :key="code.code">
                        <a v-bind:href="'#codes.' + code.code">{{
                          code.code
                        }}</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </dd>
            </dl>
          </section>
        </template>
      </section>
      <!-- 数据结构 -->
      <section v-if="contract.structs.length">
        <h3 class="section-title">数据结构</h3>
        <template v-for="struct in contract.structs">
          <section
            class="section-detail"
            :key="struct.name"
            v-bind:id="'structs.' + struct.name"
          >
            <h4 class="section-title">
              {{ struct.name
              }}<span
                class="hash-link"
                @click="toHash('#structs.' + struct.name)"
                >#</span
              >
            </h4>
            <dl class="kv-item">
              <dt>标题</dt>
              <dd>{{ struct.title }}</dd>
            </dl>
            <dl class="kv-item">
              <dt>描述</dt>
              <dd>{{ struct.description }}</dd>
            </dl>
            <dl class="kv-item">
              <dt>字段</dt>
              <dd>
                <table
                  class="table"
                  v-if="struct.fields && struct.fields.length"
                >
                  <tr>
                    <th width="250">名称</th>
                    <th width="250">类型</th>
                    <th width="50">必须</th>
                    <th>标题</th>
                    <th>描述</th>
                  </tr>
                  <tr v-for="field in struct.fields" :key="field.name">
                    <td>{{ field.name }}</td>
                    <td>
                      <a
                        v-if="isRef(field)"
                        v-bind:href="'#structs.' + getRef(field)"
                        >{{ field.type }}</a
                      >
                      <span v-else>{{ field.type }}</span>
                    </td>
                    <td>{{ !field.optional }}</td>
                    <td>{{ field.title }}</td>
                    <td>{{ field.description }}</td>
                  </tr>
                </table>

                <table class="table" v-if="struct.enums && struct.enums.length">
                  <tr>
                    <th width="250">枚举</th>
                    <th width="250">枚举值</th>
                    <th width="200">标题</th>
                    <th>描述</th>
                  </tr>
                  <tr v-for="field in struct.enums" :key="field.key">
                    <td>{{ field.key }}</td>
                    <td>{{ field.value }}</td>
                    <td>{{ field.title }}</td>
                    <td>{{ field.description }}</td>
                  </tr>
                </table>
              </dd>
            </dl>
          </section>
        </template>
      </section>
      <!-- 错误代码 -->
      <section class="section-item" v-if="codes.length">
        <h3 class="section-title">错误代码</h3>
        <section class="section-detail">
          <dl class="kv-item">
            <dt></dt>
            <dd>
              <table class="table">
                <tr>
                  <th width="100">错误代码</th>
                  <th width="250">错误描述</th>
                  <th width="250">中文</th>
                  <th width="250">英文</th>
                </tr>
                <tr v-for="errorCode in codes" :key="errorCode.code">
                  <td v-bind:id="'codes.' + errorCode.code">
                    <a v-bind:href="'#codes.' + errorCode.code">
                      {{ errorCode.code }}
                    </a>
                  </td>
                  <td>{{ errorCode.message }}</td>
                  <td>{{ errorCode.cn }}</td>
                  <td>{{ errorCode.en }}</td>
                </tr>
              </table>
            </dd>
          </dl>
        </section>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { TContract, TField } from "savml";
import { Component, Prop, Vue } from "vue-property-decorator";

const simpleTypes = [
  "number",
  "string",
  "boolean",
  "double",
  "float",
  "byte",
  "short",
  "long",
  "int",
  "int8",
  "int16",
  "int32",
  "int64",
  "uint",
  "uint8",
  "uint16",
  "uint32",
  "uint64"
];

@Component
export default class ContractView extends Vue {
  @Prop() private contract!: TContract;
  @Prop() private versions!: string[];
  @Prop() sidebarShowTitle?: boolean;
  private compareVersion: string = "";
  private hideNav: boolean = false;
  get infos() {
    let that: any = this;
    if (!that.contract) {
      return [];
    }
    return ["package", "version", "description"].map(name => {
      return {
        key: name,
        value: that.contract[name]
      };
    });
  }
  get codes() {
    let { codes, services } = this.contract;
    let errors = [];
    if (codes) {
      errors.push(...codes);
    }
    services.forEach(service => {
      service.actions.forEach(action => {
        if (action.codes) {
          errors.push(...action.codes);
        }
      });
    });
    let maps: any = {};
    errors = errors.filter(error => {
      if (maps[error.code]) {
        return false;
      }
      maps[error.code] = true;
      return true;
    });
    return errors;
  }
  isRef(field: TField) {
    if (field.type) {
      let type =
        field.type.indexOf("[") !== -1
          ? field.type.substr(0, field.type.length - 2)
          : field.type;
      if (simpleTypes.indexOf(type.toLowerCase()) === -1) {
        return true;
      }
    }
  }
  getRef(field: TField) {
    if (field.type) {
      let type =
        field.type.indexOf("[") !== -1
          ? field.type.substr(0, field.type.length - 2)
          : field.type;
      if (simpleTypes.indexOf(type.toLowerCase()) === -1) {
        return type;
      }
    }
  }
  scrollTop() {
    window.scrollTo(0, 0);
  }
  getActionPath(action: any, service: any) {
    if (action.path) {
      return action.path;
    }
    let actionName =
      action.name[0].toLowerCase() + action.name.substr(1, action.name.length);
    if (service.path) {
      return `${service.path}/${actionName}`;
    }
    return (
      "/" +
      service.name[0].toLowerCase() +
      service.name.substr(1, service.name.length) +
      "/" +
      actionName
    );
  }
  toHash(hash: string) {
    location.hash = hash;
  }
  changeVersion($event: any) {
    this.$emit("changeVersion", {
      contract: this.contract.package,
      version: $event.target.value
    });
  }
  compare() {
    this.$emit("compare", {
      contract: this.contract.package,
      version: this.contract.version,
      compareVersion: this.compareVersion
    });
  }
}
</script>
<style lang="scss">
.contract-view {
  display: flex;
  flex-direction: row;
  .contract-nav {
    display: flex;
    background-color: #f1f2f59e;
    padding-right: 10px;
    min-width: 330px;
    flex: none;
  }
  .contract-content {
    display: flex;
    flex: 1;
    margin: 20px;
    flex-direction: column;
  }
  .contract-group-title {
    margin: 10px 0;
    padding-left: 40px;
    color: #b1b1b1;
  }
  .contract-list {
    list-style: none;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 200px;
    font-size: 16px;
  }
}
.menu-root {
  list-style-type: none;
  margin: 0;
  line-height: 1.5em;
  li {
    margin-top: 0.5em;
  }
  ul {
    list-style-type: none;
    margin: 0;
    line-height: 1.5em;
    padding-left: 1em;
  }
  h3 > i {
    font-size: 12px;
  }
  .sidebar-link {
    color: #4f5959;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      border-bottom: 2px solid #42b983;
    }
    &.current {
      font-weight: bold;
      color: #42b983;
    }
    i {
      font-size: 12px;
    }
  }
}

.kv-item {
  display: flex;
  color: #4f5959;
  font-size: 16px;
  margin: 5px 0;
  > dt {
    margin-left: 20px;
    width: 40px;
  }
  > dd {
    flex: 1;
  }
}

.section-title {
  color: #4f5959;
}

.nav-title {
  color: #4f5959;
  font-weight: 200;
}

.table {
  border-spacing: 0;
  min-width: 100%;
  font-size: 15px;
  color: #34495e;
  border-collapse: collapse;

  th {
    background-color: #f3f3f3;
    text-align: left;
    padding: 8px;
    font-weight: 400;
    border-bottom: 1px solid #eee;
  }
  td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.section-item {
  width: 100%;
  overflow-x: scroll;
}

.hash-link {
  color: #45b984;
  display: none;
  margin-left: 5px;
  cursor: pointer;
}

.section-title:hover .hash-link,
.nav-title:hover .hash-link {
  display: inline;
}

.section-detail {
  margin-top: 10px;
  padding: 5px 5px;
}
</style>
