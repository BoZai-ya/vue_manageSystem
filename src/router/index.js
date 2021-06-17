import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views//Home.vue";
import Welcome from "../components/Welcome.vue";
import UsersList from "../components/users/UsersList.vue";
import LimitList from "../components/limit/LimitList.vue";
import Roles from "../components/limit/Roles.vue";
import Categories from "../components/goods/Categories.vue";
import Params from "../components/goods/Params.vue";
import Goods from "../components/goods/Goods.vue";
import Orders from "../components/orders/Orders.vue";
import Reports from "../components/reports/Reports.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: Welcome,
      },
      {
        path: "/users",
        component: UsersList,
      },
      {
        path: "/rights",
        component: LimitList,
      },
      {
        path: "/roles",
        component: Roles,
      },
      {
        path: "/categories",
        component: Categories,
      },
      {
        path: "/params",
        component: Params,
      },
      {
        path: "/goods",
        component: Goods,
      },
      {
        path: "/orders",
        component: Orders,
      },
      {
        path: "/reports",
        component: Reports,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const hasToken = window.sessionStorage.getItem("token");
  // 没储存token 直接回到登录页
  if (!hasToken) return next("/login");
  next();
});

export default router;
