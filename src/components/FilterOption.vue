<template lang='html'>
  <div class="filter-option">
    <div class="item"
      v-for="(item, index) in filterItems"
      :key="index">
      <span>{{item.itemName}}</span>
      <el-select
        v-if="item.in_type !== 'input'"
        v-model="item.value"
        @change="changeSelect()"
        clearable
        :placeholder="item.placeholder">
        <el-option
          v-for="(child, index) in item.options"
          :key="index"
          :label="child.label"
          :value="child.value">
        </el-option>
      </el-select>
      <el-input
        v-if="item.in_type === 'input'"
        :placeholder="item.placeholder"
        v-model="item.value"
        prefix-icon="el-icon-search"
        @keyup.native="selectText($event)"
        @clear="changeSelect"
        type="text"
        clearable>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filterItems: Array
  },
  methods: {
    changeSelect () {
      this.$emit('filter-search', this.filterItems)
    },
    selectText (e) {
      if (e.key === 'Enter') {
        this.$emit('filter-search', this.filterItems)
      }
    }
  }
}

</script>
<style lang='scss'>
</style>
