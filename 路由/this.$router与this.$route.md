**this.$router与this.$route**

通过注入路由器，我们可以在任何组件内通过 `this.$router` 访问路由器，也可以通过 `this.$route` 访问当前路由。比如，我当前所在的路由为`Bar.vue`,就可以在此组件内通过`this.$router` 与`this.$route`，获取任何我想要的路由参数。

```vue
<!--Bar.vue-->
<template>
    <div id="bar">
        <h1>BAR</h1>
    </div>
</template>

<script>
    export default {
        name: "Bar",
        created() {
            //通过注入路由器，我们可以在任意组件内通过this.$router访问整个项目的所有路由，
            //通过this.$route访问当前路由
            //通过这些路由参数我们可以获取当很多有用的信息

            //全路由：VueRouter {app: Vue, apps: Array(1), options: {…}, beforeHooks: Array(0), resolveHooks: Array(0), …}
            console.log(this.$router);
            //当前路由：{name: "home", meta: {…}, path: "/dashboard/home", hash: "", query: {…}, …}
            console.log(this.$route);
        }
    }
</script>

<style scoped>

</style>
```

**this.$router与this.$route有何区别**

在控制台打印两者可以很明显的看出两者的一些区别：

![](https://raw.githubusercontent.com/rainyGLC/gitPress/master/images/8.png)

- $router为VueRouter实例，想要导航到不同URL，则使用$router.push方法
- $route为当前router跳转对象，里面可以获取name、path、query、params等