<template>
  <v-container color="primary">
    <v-row>
      <v-col>
        <span >{{ dTitle }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          :width="dWidth"
          v-model="new_data"
          filled
          :label="dLabel"
          hide-details="auto"
          append-icon="mdi-plus"
          @click:append="addNewItem"

        >
        </v-text-field> 
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list fluid>
          <v-list-item v-for="dataItem in dValue" :key="dataItem">
            <v-list-item-content>
              <span>{{ dataItem }}</span>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon @click="moveUp(dataItem)">mdi-arrow-up</v-icon>
                <v-icon @click="deleteItem(dataItem)">mdi-delete</v-icon>
                <v-icon @click="moveDown(dataItem)">mdi-arrow-down</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  components: {},
  name: "dList",
  props: {
    dTitle: String,
    dLabel: String,
    dValue: [],
    dWidth: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      new_data: "",
    };
  },
  methods: {
    addNewItem() {
      // @ts-ignore
      this.dValue.push(this.new_data);
      this.new_data = '';
    },
    deleteItem(data: any) {
      // @ts-ignore
      this.dValue.splice(this.dValue.indexOf(data), 1);
    },
    moveUp(data: any) {
      // @ts-ignore
      let i: number = this.dValue.indexOf(data);
      if (i > 0) {
        // @ts-ignore
        this.dValue.splice(i, 1);
        // @ts-ignore
        this.dValue.splice(i - 1, 0, data);
      }
    },
    moveDown(data: any) {
      // @ts-ignore
      let i: number = this.dValue.indexOf(data);
      // @ts-ignore
      if (i < this.dValue.length - 1) {
        // @ts-ignore
        this.dValue.splice(i, 1);
        // @ts-ignore
        this.dValue.splice(i + 1, 0, data);
      }
    },
  },
});
</script>

<style>
</style>

<style>
</style>