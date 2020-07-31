### 一、`props` / `$emit`

父组件通过`props`的方式向子组件传递数据，而通过`$emit` 子组件可以向父组件通信。

#### 1. 父组件向子组件传值

下面通过一个例子说明父组件如何向子组件传递数据：在子组件`article.vue`中如何获取父组件`section.vue`中的数据`articles:['红楼梦', '西游记','三国演义']`

```vue
<!--父组件 Father.vue-->
<template>
    <Child :articleList="articleList"></Child>
</template>
<script>
    import Child from './child/Child'
    export default {
        name: "Father",
        components:{
            Child
        },
        data(){
            return {
                articleList: ['红楼梦', '西游记', '三国演义']
            }
        },
        methods:{

        }

    }
</script>

<style scoped>

</style>
```

子组件

```vue
<!--子组件 Child.vue-->
<template>
    <div id="ctn-tex">
        <ul>
            <li v-for="(value,index) in articleList" :key="index">{{value}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Child",
        props:['articleList'],//接收父组件传来的数据articleList
    }
</script>

<style scoped>

</style>
```

#### 2. 子组件向父组件传值

对于`$emit` 我自己的理解是这样的: `$emit`绑定一个自定义事件, 当这个语句被执行时, 就会将参数 arg 传递给父组件,父组件通过v-on监听并接收参数。 通过一个例子，说明子组件如何向父组件传递数据。 在上个例子的基础上, 点击页面渲染出来的`ariticle`的`item`, 父组件中显示在数组中的下标

```vue
<!--父组件 Father.vue-->
<template>
    <Child @aaa="bbb"></Child
</template>

<script>
    import Child from './child/Child'
    export default {
        name: "Father",
        components:{
            Child
        },
        data(){
            return {
               
            }
        },
        methods:{
            bbb(evtValue){//获取子组件传来的数据
                console.log(evtValue);//{age: 20,job: "web",name: "小李子",sex: "male"}
            }
        }

    }
</script>

<style scoped>

</style>
```

子组件：

```vue
<!--子组件 Child.vue-->
<template>
    <div id="ctn-tex">
         <input type="button" @click="emitIndex()" value="向父组件发送数据">
    </div>
</template>

<script>
    export default {
        name: "Child",
        data(){
            return {
                info : {
                    name : "小李子",
                    age : 20,
                    sex : "male",
                    job : "web"
                }

            }
        },
        methods: {
            emitIndex(){
                let obj = this.info;
                this.$emit('aaa', obj);//向父组件发射数据obj
            }
        }
    }
</script>

<style scoped>

</style>
```

