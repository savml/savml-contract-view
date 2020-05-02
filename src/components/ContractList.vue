<template>
  <div>
    <div class="contract-header">合约列表({{contracts.length}})</div>
    <ul class="contract-list">
      <li v-for="contract in contracts" :key="contract.contract"><router-link :to='{
        name:"viewer", 
        params:{
          contract: contract.contract
        }}'>{{contract.name}}</router-link></li>
    </ul>
    <div class="contract-header">合约使用规范</div>
    <pre class="contract-readme" v-html="`
import {Contract, Service, Action, Struct, Field, Enum} from 'savml'

export default class SContract implements Contract {
  /**
   * 合约基本信息
   */
  // 合约ID
  package = 'com.contract.example'
  // 合约解析器版本号
  contract = '1.0.0'
  // 当前合约版本, 合约修改后需要提升版本号
  version = '0.0.1'
  // 合约标题
  title = '合约名称'
  // 合约详细描述
  description = '合约的详细描述'
  // 合约数据结构定义
  structs = <Struct[]>[
    // 枚举类型
    {
      name: 'TSex',
      title: '性别',
      description: '男女性别',
      enums: <Enum[]>[
        {
          key: 'male',
          value: 1,
          title: '男'
        },
        {
          key: 'female',
          value: 2,
          title: '女'
        },
      ]
    },
    // 对象类型
    {
      // 数据结构名称, 已T开头
      name: 'TEmployProfile',
      // 数据结构标题
      title: '员工基本信息',
      // 数据字段
      fields: <Field[]>[
        {
          // 字段名称
          name: 'id',
          // 字段类型, 可以用 String/Number/Boolean等JS函数
          // 字段类型只能是一种固定类型
          // 支持的数据类型有 Int Uint Int32 UInt32等后端类型
          type: Number,
          // 字段标题
          title: '员工id',
        },
        {
          name: 'name',
          type: 'string',
          title: '姓名',
          // 字段非必填
          optional: true, 
        },
        {
          name: 'sex',
          // 可以使用Struct定义的名称
          type: 'TSex',
          title: '性别',
          // 字段非必填
          optional: true, 
        },
      ]
    },
  ]
  // 合约服务定义
  services = <Service[]>[
    {
      // 服务名称
      name: 'Example',
      // 服务路径前缀
      path: '/v1/example',
      // 服务接口列表
      actions: <Action[]>[
        {
          // 接口名称
          name: 'getEmployProfile',
          // 接口标题
          title: '获取员工信息',
          // 接口详细描述
          description: '获取员工基本信息, 比如年龄/性别等',
          // 响应数据, 只能是Struct, 不能是数组, 如果没有响应数据
          response: 'TEmployProfile',
        },
        {
          name: 'getEmployProfile',
          // 接口路径, 相对路径, 如果不写默认使用name
          path: 'getEmployProfile',
          // 接口方法, 不写默认POST
          method: 'GET',
          // 请求数据, 可以直接定义Struct
          request: <Struct>{
            fields: [
              {
                name: 'id',
                type: Number,
              },
            ]
          },
        },
      ]
    }
  ]
}
`"></pre>
  </div>
</template>
<script lang="ts">
import { Component, Provide, Vue, Prop } from "vue-property-decorator";

@Component
export default class ContractList extends Vue {
  @Prop()
  private contracts!: object[]
  private contract: string = ''
  jumpContract() {
    this.$emit('jump', this.contract)
  }
}

</script>
<style lang="scss">
  .contract-header {
    margin: 20px;
    color: #4f5959;
    font-weight: 200;
  }
  .contract-list {
    list-style-type: none;
    a {
      color: #4f5959;
      text-decoration: none;
      cursor: pointer;
    }
  }
  .contract-readme {
    margin: 10px;
  }
</style>
