vuex学习

序言：今天我们简单说一下vuex的使用，vuex是什么呢，相当于react的redux，如果项目使用数据过多的话，直接管理是非常不方便的，那么采用vuex，那些繁琐的问题就迎刃而解了，首先我们先看看官方对vuex的说明：

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

说白了就是vue的状态管理，你只需要每次动态的改变这些状态就行，数据就会自动渲染

**一、创建vue项目**

1、安装vue项目

```js
vue init webpack projectName
```

2、进入项目目录

```js
cd projectName
```

3、安装vuex

```js
npm i vuex --save
```

4、项目启动

```js
npm run dev/npm start
```

ps:如果npm安装慢的话，建议使用淘宝镜像:cnpm
安装淘宝镜像：

```js
npm i -g cnpm --registry=https://registry.npm.taobao.org
```

**二、vuex的引入**

项目安装成功之后，初始的文件目录格式都是一样的（基于vue2.X创建，vue3.X会与此有区别），像我这样：

![](https://segmentfault.com/img/bVbzUdY)

然后我们简单的使用，在 main.js 中引入 vuex

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
```

记得一定要挂载使用它，就是这一句：*Vue.use(Vuex)*

**三、在 main.js 中加入**

```js
const store = new Vuex.Store({ // store对象
    state : {
      count : 0
    }
})
```

**四、把刚才的 store 对象实例化到 Vue 中**

```js
new Vue({
  el: '#app',
  store,//加入store对象
  router,
  components: { App },
  template: '<App/>'
})
```

完成这一步我们就可以使用了，一个简单的vuex的state就可以了，怎么用呢?

```vue
<div id="hello">
    <p>{{$store.state.count}}</p>
</div>
```

**五、很明显，刚才只是简单的一例子，如果你需要做大型的项目，不可能把store对象写在 main.js 里，这样是非常不方便管理的，所以我们需要在 src 下新建一个 文件夹 store 专门存放 store 对象，然后我们新建一个文件 index.js**

```js
//index.js
import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);
export default new vuex.Store({
    state:{        
        count:0    
    }
})
```

相应的main,js就需要做修改了

```js
import store from './store/index' 
new Vue({  
    el: '#app',
    router,
    store,//这个store是刚才创建的index文件引入的
    template: '<App/>',
    components: { App }
})
```

这样做就是为了把 store 对象分离出去，方便管理，但是你会发现这个 store 对象是全局的所有组件都可以使用，如果我们的组件多了，数据多了，全部堆放在一起，是不是特别臃肿，所以现在我们就该使用 modules 了。
首页我们新建一个js文件存放一个组件可能用到的 store 对象，比如我新建 head.js，在这里我们不需要引用 vuex 了，只需要默认 export default就行了

```js
//head.js
export default {
    state: {
        count: 0    
    }
}
```

然后我们把在 index.js 中使用 modules　

```js
import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex); 
import HeadStore from './heade';//引入刚才的heade.js 
export default new vuex.Store({
    modules: {
        Heade: HeadStore    
    }
})
```

现在我们管理起来就方便多了，比如还有其他的呢,我们放在 modules 下就可以了，比如，我们除了 head.js 里管理的是一个组件的 store对象，我们还有一个 content.js 来管理另外一个组件的 store 对象，那么我们在 store 文件夹下载新建一个 content.js,和 head.js一样，只需要默认输出就可以了。

```JS
//content.js
export default {
    state: {
        cont: '这是content内容'    
    }
}
```

然后我们在 index.js 中引入挂在 modules 下就可以啦

```js
//index.js
import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import HeadStore from './head' //引入刚才的head.js
import ContentStore from './content' //引入content.js 
export default new vuex.Store({
    modules: {
        Head: HeadStore,//挂载
        Content: ContentStore//挂载
    }
})
```

这样是不是方便多了，但是怎么用呢，很简单，现在需要通过modules去找他，之前的方法：改成`$store.state.Head.count`就行了，很明显这是找到了head.js下的count值，那么找content.js下cont的值呢？一样的，换一下modules的名就行`$store.state.Content.cont`

```html
<template>
  <div id="app">
    <!--head组件-->
    <p>{{$store.state.Head.count}}</p>
    <br>
      <!--content组件-->
    <p>{{$store.state.Content.cont}}</p>
  </div>
</template>
```

输出结果分别为：0，这是content内容

六、那么接下来你觉得问题解决了吗，难道你们的项目组件所有的状态都用这一个，那如果我需要**动态的改变他的状态**呢，怎么办？没事，这不 `mutations` 来了吗，问题就好多了,怎么用呢，这是干嘛的呢，说白了就是动态的改变 `state` 的值完成页面的同步渲染，看看用法吧，直接在state对象后面加就行了

```js
//head.js
export default {
    state: {
        count: 0
    },
    mutations: {
        Count(state){
            state.count +=10;
        }
    }
}
```

解释一下，`mutations` 对象是函数，默认传值是 state，也就是上面的state，所以可以直接操作 state.count，怎么用呢，很简单，比如页面有一个按钮，点击改变state的count的值

```vue
<input type="button" @click="$store.commit('Count')" value="数字叠加">
```

此时输出结果为：10
commit('Count ')调用mutations的固定方法，参数为mutations的方法名，当然commit不止传一个参数，也可以传很多，比如：

```vue
<input type="button" @click="$store.commit('Count',10)" value="数字叠加">
```

可以在head.js的mutations下Count方法接收它

```js
//head.js
export default {
    state: {
        count: 0
    },
    mutations: {
        Count(state,n){
            state.count +=n;
        }
    }
}
```

此时输出结果为：20

到这一步为止，我们已经可以正常的动态的修改 state 来渲染在页面了，你会发现，mutations 是同步的，只要你在一个组件执行`mutations` 的方法了，那所有的组件只要用到 `mutations` 的方法都会同步进行改变，这并不是我们想要的结果，所以，`actions` 来解决问题了，写法一样

```js
//head.js
export default {
    state: {
        count: 0
    },
    mutations: {
        Count(state,n){
            state.count +=n;
        }
    },
    actions: {
       Account(context){
           context.commit('Count');
       }
    }
}
```

接着解释，`actions` 和 `mutations` 的写法一样，都是函数，但是 `actions` 的默认参数是context，context.commit('Count ')的意思是触发mutations下的Count函数，那么怎么触发actions的函数呢，方法就是

```vue
<input type="button" @click="$store.dispatch('Account')" value="数字叠加">
```

`dispatch` 方法是官方固定触发 `actions` 下函数的方法。官方推荐 , 将异步操作放在 `actions` 中

还有一个属性我觉得也没有必要说了，getters,解释一下它的作用
`getters` 和 vue 中的 `computed` 类似 , 都是用来计算 state 然后生成新的数据 ( 状态 ) 的。比如我们 head.js 的 state 有一个值 show:false getters就是计算与false相反的，但是它计算的值是不能直接修改的， 需要对应的  state 发生变化才能修改。　

```js
//head.js
export default {
    state: {
        count: 0
    },
    mutations: {
        Count(state){
            state.count +=10;
        }
    },
    actions: {
       Account(context){
           context.commit('Count');
       }
    },
    getters: {
        not_show(state){
            return !state.count;
        }
    }
}
```

它也是默认接受state
最后一点就是为了方便操作开发，一般情况，`$store.state.Head.show`写起来不是很方便，那么vuex的辅助函数`mapState`、`mapGetters`、`mapActions`就可以解决这个问题，把 `store` 对象那个映射到this。我们只需要用到的组件中这样写：

```vue
<!--HelloWorld.vue-->
<template>
    <div class="hello">
        <span>我是HelloWorld组件中的count值：</span>
        <p>{{num}}</p>
    </div>
</template>

<script>
    import { mapState } from "vuex" //引入mapState
    export default {
        name: 'HelloWorld',
        props: {

        },
        data(){
            return {
                num:""
            }
        },
        computed:{
            ...mapState({
                count:state=>state.Head.count //映射
            })
        },
        created() {
            this.num = this.count; //使用
        },
        methods:{

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
```

现在我们就直接可以用 this.count 去找到 `state` 下count的值了，`created`方法是页面刚载入加载完事执行的方法，完后动态的赋值给msg，`mapState`一般放在`computed`计算属性中，`mapActions`一般放在`methods`下。

到这一步为止vuex的学习使用就结束了，你可以尽情的去操作数据了，也不用担心会混乱，如果您连我写的文档都看不懂，那你不适合学习vue，放弃吧！ 哈哈哈哈

以上来自翻译，原文链接地址为：

[vue使用教程]: https://segmentfault.com/a/1190000020912384





