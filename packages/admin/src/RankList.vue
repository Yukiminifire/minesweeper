<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import { getRankList, RankInfo } from '@minsweeper/api'
export default defineComponent({
  setup() {
    const rankList: Ref<RankInfo[]> = ref([])

    onMounted(async () => {
      rankList.value = await getRankList()
    })

    const deleteRow = (index: number) => {
      rankList.value.splice(index, 1)
    }

    return {
      deleteRow,
      rankList,
    }
  },
})
</script>

<template>
  <h2 class="flex justify-center m-4">Global RankList</h2>
  <div class="flex justify-center">
    <div class="flex w-120 border m-6">
      <el-table :data="rankList" style="width: 100%" max-height="250">
        <el-table-column label="Rank" width="120">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="time" label="Time" width="120" />
        <el-table-column fixed="right" label="Operations">
          <template #default="scope">
            <el-button
              text
              size="small"
              @click.prevent="deleteRow(scope.$index)"
            >
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
