**vue-router如何传递参数**

vue-router传递参数有三种方法：

1. **使用name传递**；之前在配置路由的时候，出现一个name属性，但是不知道具体有什么用，在路由中它可以用来 传递参数。在router.js中将路由都写好。

   接收参数： 在我们需要接收它的页面里添加：

   ```vue
   <!--App.vue-->
   <template>
     <div id="app">
         <!-- 路由出口 -->
         <!-- 路由匹配到的组件将渲染在这里 -->
         <p>我是router-name:{{$route.name}}</p>
       <router-view></router-view>
     </div>
   </template>
   ```

   ![images](https://raw.githubusercontent.com/rainyGLC/gitPress/master/images/9.png)

比如在`APP.vue`中接收的，我希望切换每个页面都能看见每个页面各自的参数。如图

![images](https://raw.githubusercontent.com/rainyGLC/gitPress/master/images/11.png)

**2.to来传递**

1.利用router-link 中的to来传参，看语法：

```js
<router-link v-bind:to="{name:'xxx',params:{key:value}}"></router-link>
```

- 首先：to需要绑定；

- 传参使用类似与对象的形式；

- name就是我们在配置路由时候取的名字；

- 参数也是采用对象的形式

  1.实际操作一下：

  ```js
  <router-link v-bind:to="{name:'about',params:{username:'rainy'}}">关于我</router-link>
  ```

  这里我们**注意**to的写法，前面加了冒号，因为那是绑定的，传递一个username过去，值为rainy

  2.在about.vue中接收参数

  ```vue
  <p>传递的名字是：{{$route.params.username}}</p>
  ```

  如图：

  ![images](https://raw.githubusercontent.com/rainyGLC/gitPress/master/images/12.png)

  

  **3.采用url传参**

  通过设置props的值来实现路由传参的一种形式。根据props的值的类型，可以分为三种传参形式**布尔模式、对象模式、函数模式**

  修改router.js里的path，这里我们修改about.vue组件

  ![images](https://raw.githubusercontent.com/rainyGLC/gitPress/master/images/13.png)

在App.vue组件里传递参数

```vue
<router-link to="/about/1/about">About</router-link>
```

在about.vue组件里显示我们要展示的内容（接收参数）

```vue
<a>id是:{{$route.params.id}}</a>
<a>title是:{{$route.params.title}}</a>
```

结果如图：

![images](https://raw.githubusercontent.com/rainyGLC/gitPress/master/images/14.png)

**阅读vue官方文档，总结的路由组件传参**

在vue组件中使用，以下三种模式都可以：

```vue
//Main.vue
<router-link to="/Bar">Go to Content</router-link>
```

**一：布尔模式**：`props:true`

如果 `props` 被设置为 `true`，`route.params` 将会被设置为组件属性。

在组件中使用 `$route` 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。

使用 `props` 将组件和路由解耦：

**取代与 `$route` 的耦合**

```vue
<!--Bar.vue-->
<template>
    <div id="bar">
        <h1>BAR</h1>
        <!--直接用花括号取值-->
        <a>id是:{{id}}</a>
        <br>
        <a>title是:{{title}}</a>
    </div>
</template>

<script>
    export default {
        name: "Bar",
        props:["id","title"],
    }
</script>
```

在router/index.js中进行解耦：

```js
//router/index.js
//创建 router 实例
export default new VueRouter({
    mode: 'history',
    routes:[//配置路由，这里是个数组，每一个连接都是一个对象
        {
            path: "/", //路径，就是打开localhost:8080一样，# 后面接的名称
            name: "main", //路由名称
            component:Main //对应的组件模板
        },
        {
            path: "/Bar/:id/:title",
            props: true,//解耦 如果 props 被设置为 true，route.params 将会被设置为组件属性。
            name: "bar",
            component: Bar
        },
    ]
});
```

**二、对象模式：**props:Object

如果 `props` 是一个对象，它会被按原样设置为组件属性。当 `props` 是静态值的时候有用。

```vue
<!--Content.vue-->
<template>
    <div id="content">
        <h1>Content</h1>
        <p>{{userName}}</p>
        <br/>
        <p>{{userage}}</p>
    </div>
</template>

<script>
    export default {
        name: "Content",
        props:['userName','userage'],
    }
</script>
```

```js
//router/index.js
//创建 router 实例
export default new VueRouter({
    mode: 'history',
    routes:[//配置路由，这里是个数组，每一个连接都是一个对象
        {
            path: "/", //路径，就是打开localhost:8080一样，# 后面接的名称
            name: "main", //路由名称
            component:Main //对应的组件模板
        },
        {
            path: "/Con",
            props: { userName: 'LiMing',userage:"20"},//props为对象
            name: "con",
            component: Con
        },
    ]
});
```

**二、函数模式：**props:Function

你可以创建一个函数返回 `props`。这样你便可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。

```vue
<!--Foo.vue-->
<template>
    <div id="foo">
        <h1>FOO</h1>
        <p>名字是：{{username}}</p>
        <p>年龄是：{{userage}}</p>
    </div>
</template>

<script>
    export default {
        name: "Foo",
        props:["username","userage"],
    }
</script>
```

```js
//创建 router 实例
export default new VueRouter({
    mode: 'history',
    routes:[//配置路由，这里是个数组，每一个连接都是一个对象
        {
            path: "/", //路径，就是打开localhost:8080一样，# 后面接的名称
            name: "main", //路由名称
            component:Main //对应的组件模板
        },
        {
            path: "/Foo",
            props:()=>{//函数模式
                return {
                    username : "LiMing",
                    userage : 26
                }
            },
            name: "foo",
            component: Foo
        },
    ]
});
```



