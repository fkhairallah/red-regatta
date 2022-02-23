<template>
 
    <v-card
      id="gauge_card"
      :color="warningColor?'warning':''"
      elevation="4"
      height="100"
      width="100"
      class="mx-2 my-2 pa-0"
    >
      
      <v-card-text>
        <div class="text-left font-weight-bold text-h7" >{{ dTitle }}</div>
        <div class="text-center font-weight-black text-h5" >{{ dValue }}</div>
        <div class="text-right"> {{ dUnit }}</div>
      </v-card-text>
    </v-card>

</template>


<script>
export default {
  name: "dGauge",
  created() {
    if (this.dWarn) {
      this.timer = setInterval(this.blinkWarning, 3000);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  props: {
    dTitle: String,
    dValue: String,
    dUnit: String,
    dWarn: Boolean,
  },
  data() {
    return {
      warningColor: false,
      timer: null,
    };
  },
  methods: {
    blinkWarning() {
      if (this.dWarn) {
        this.warningColor = !this.warningColor;
      } else {
        this.warningColor = false;
        clearInterval(this.timer);
      }
    },
  },
};
</script>
