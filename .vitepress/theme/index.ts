// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import User from "./components/CusUser.vue";
import Invite from "./components/CusInvite.vue";
import Topay from "./components/CusTopay.vue";

import "bootstrap/scss/bootstrap-cus.scss";
import "./style.css";

export default {
  // extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    console.log(app, router, siteData);
    app.component("CusUser", User);
    app.component("CusInvite", Invite);
    app.component("CusTopay", Topay);
    // ...
  },
} satisfies Theme;
