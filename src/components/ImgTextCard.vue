<template>
  <div class="card-list">
    <div v-for="(item, index) in cardsData" :key="index">
      <slot :data="item" name="img"></slot>
      <div class="card-main">
        <div class="card-header">
          <h5>{{item.name}}</h5>
          <slot :data="item" name="tag"></slot>
        </div>
        <div class="card-content">
          <slot :data="item" name="content"></slot>
        </div>
        <div class="card-footer">
          <slot :data="item" name="footer"></slot>
        </div>
      </div>
      <div class="operation-wrap">
        <slot :data="item" name="operation"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardsData: Array
  }
}

</script>
