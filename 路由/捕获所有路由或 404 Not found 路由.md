常规参数只会匹配被 `/` 分隔的 URL 片段中的字符。如果想匹配**任意路径**，我们可以使用通配符 (`*`)：

```js
{
  // 会匹配所有路径
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}
```

当使用 *通配符* 路由时，请确保路由的顺序是正确的，也就是说含有*通配符*的路由应该**放在最后**。路由 `{ path: '*' }` 通常用于**客户端 404 错误**。

这样当我们访问不存在的路径(页面)时，会自动帮助我们跳转到**404页面**。这个在项目中还是经常用到的。

```js
//router/index.js
export default new VueRouter({
    routes:[
        {
            path: "/", 
            name: "main",
            component:Main
        },
        {
            path: "/Foo",
            props:()=>{
                return {
                    username : "LiMing",
                    userage : 26
                }
            },
            name: "foo",
            component: Foo
        },
        {
            path: "/Bar/:id/:title",
            props: true,
            name: "bar",
            component: Bar
        },
        {
            path: "/Art",
            name: "art",
            component: Art
        },
        {
            path: "*",
            name: "notFound",//404页面，放在最后，当所有的路由都没匹配到时，进入此页面
            component:NotFound
        },
    ]
});
```

