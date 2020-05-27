<template>
  <li :key="subitem.name" class="menu-item">
    <a
      class="sidebar-link"
      v-bind:href="getUrl(subitem)"
      v-bind:title="subitem.description || subitem.title || subitem.name"
    >
      {{ subitem.name }}
      <i v-if="sidebarShowTitle && subitem.title">{{ subitem.title }}</i>
    </a>
    <ul class="menu-sub" v-if="subitem.views && subitem.views.length">
      <MenuItem
        :getUrl="getUrl"
        :sidebarShowTitle="sidebarShowTitle"
        :subitem="item"
        v-for="item in subitem.views"
        :key="item.name"
      >
      </MenuItem>
    </ul>
  </li>
</template>
<script>
export default {
  name: "MenuItem",
  props: {
    sidebarShowTitle: {
      type: Boolean,
      default: Boolean
    },
    subitem: {
      type: Object
    },
    getUrl: {
      type: Function,
      default: () => null
    }
  }
};
</script>
