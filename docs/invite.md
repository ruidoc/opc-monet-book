---
layout: home
---

<CusInvite :code="code" />

<script setup lang="ts">
import { ref, onMounted } from "vue";
const code = ref('')
onMounted(()=> {
  let query_str = new URLSearchParams(window.location.search)
  let query = Object.fromEntries(query_str.entries())
  code.value = query.code
})

</script>
