import { vueflow } from "@/router/enums";

export default {
  path: "/vue-flow",
  redirect: "/vue-flow/index",
  meta: {
    icon: "ep/set-up",
    title: "vue-flow",
    sort: vueflow
  },
  children: [
    {
      path: "/vue-flow/index",
      name: "VueFlow",
      component: () => import("@/views/vue-flow/layouting/index.vue"),
      meta: {
        title: "vue-flow"
      }
    }
  ]
} satisfies RouteConfigsTable;
