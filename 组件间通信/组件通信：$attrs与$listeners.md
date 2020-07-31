多级组件嵌套需要传递数据时，通常使用的方法是通过`vuex`。如果仅仅是传递数据，而不做中间处理，使用 vuex 处理，有点大材小用了。所以就有了 **$attrs / $listeners** ，通常配合 **inheritAttrs** 一起使用。

**inheritAttrs** ：默认值为true。inheritAttrs:true表示继承除props之外的所有属性；inheritAttrs:false表示只继承`class`属性

`$attrs：`可以通过`v-bind = "$attrs"`传入内部组件。当一个组件没有声明任何`props`时，它包含所有父作用域中的绑定（class和style除外）。

`$listeners：`可以通过v-on = "`$listeners：`"传入内部组件。它是一个对象，包含了作用在这个组件上的所有事件监听器，相当于子组件继承了父组件的事件。

**问题**：现有3个嵌套组件，A->B，B->C。 **现在我们需要在A中对C的props赋值，监听C的emit事件**

![](https://user-gold-cdn.xitu.io/2019/4/22/16a42eda0804d31b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

A组件与C组件通信，我们有多少种解决方案？

1. 我们使用`vuex`来进行数据管理，依赖于`vuex`我们可以一次改变，任何一个组件中都能获取。但是如果多个组件共享状态比较少，使用`vuex`过于麻烦和难以维护。`element-ui`中大量采用此方法。

2. 自定义`vue bus`事件总线，原理类似`vuex`，使用特别简单。`bus`适合碰到组件跨级兄弟组件等无明显依赖关系的消息传递，原生app开发中经常用到，但是缺点是`bus`破坏了代码的链式调用，大量的滥用将导致逻辑的分散，出现问题后很难定位，降低了代码可读性。

3. 使用B来做中转，A传递给B，B再给C**，**这是最容易想到的方案，但是如果嵌套的组件过多，需要传递的事件和属性较多，会导致代码繁琐，代码维护困难。

   

   **对于我们这种情况，3种方式都有局限性**

   使用`$attrs`和`$listeners`可以方便的解决此类问题。我们只需要在Child组件中对引入的GrandSon组件增加下面两个属性即可绑定所有的属性和事件。

**Father.vue**

```html
<!--Father.vue-->
<template>
    <div>
        <child :name="name" :age="age" :infoObj="infoObj" @updateInfo="updateInfo" @delInfo="delInfo" />
    </div>
</template>
<script>
    import Child from './child/child.vue'

    export default {
        name: 'father',
        components: { Child },
        data () {
            return {
                name: 'Lily',
                age: 22,
                infoObj: {
                    from: '上海',
                    job: 'policeman',
                    hobby: ['reading', 'writing', 'skating']
                }
            }
        },
        methods: {
            updateInfo() {
                console.log('update info');
            },
            delInfo() {
                console.log('delete info');
            }
        }
    }
</script>

<style scoped>

</style>
```

**Chile.vue**

```html
<template>
<!--Child.vue-->
    <grand-son :height="height" :weight="weight" @addInfo="addInfo" v-bind="$attrs" v-on="$listeners"  />
    <!-- 通过 $attrs 将父作用域中的属性，传入 grandSon 组件，使其可以获取到 father 中的属性-->
    <!-- 通过 $listeners 将父作用域中的事件，传入 grandSon 组件，使其可以获取到 father 中的事件-->
</template>
<script>
    import GrandSon from './grandSon/GrandSon.vue'
    export default {
        name: 'child',
        components: { GrandSon },
        props: ["name"],
        data() {
            return {
                height: '180cm',
                weight: '70kg'
            };
        },
        mounted() {
            console.log(this.$attrs); //age, infoObj, 因为父组件共传来name, age, infoObj三个值，由于name被 props接收了，所以只有age, infoObj属性

            console.log(this.$listeners); // updateInfo: f, delInfo: f
        },
        methods: {
            addInfo () {
                console.log('add info')
            }
        }
    }
</script>

<style scoped>

</style>
```

**GrandSon.vue**

```html
<template>
    <div>
        <div>
            <p>姓名：{{name}} </p>
            <p>年龄：{{age}} </p>
            <p>身高：{{high}} </p>
            <p>体重：{{weight}} </p>
            <p>来自：{{from}} </p>
            <p>职位：{{job}} </p>
            <p>爱好：{{hobby}} </p>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'grandSon',
        props: ["height"],
        data(){
            return {
                name : null,
                age : null,
                high : null,
                weight : null,
                from : null,
                job : null,
                hobby : null,
            }
        },
        mounted() {
            this.name = this.$attrs.name;
            this.age = this.$attrs.age;
            this.high = this.$attrs.height;
            this.weight = this.$attrs.weight;
            this.from = this.$attrs.infoObj.from;
            this.job = this.$attrs.infoObj.job;
            this.hobby = this.$attrs.infoObj.hobby;
            console.log("属性",this.$attrs);
            /*
            * weight,age,infoObj,
            * 因为父组件共传来name, age, height,weight,infoObj五个值，
            * 由于name,height被 props接收了，所以只有weight,age,infoObj属性
            *
            * */
            console.log("事件",this.$listeners); // updateInfo: f, delInfo: f, addInfo: f
            this.$emit('updateInfo'); // 可以触发 father 组件中的updateInfo函数
            this.$emit('delInfo'); // 可以触发 father 组件中的updateInfo函数
            this.$emit('addInfo');// 可以触发 Child 组件中的addInfo函数
        }
    }
</script>

<style scoped>

</style>

```

