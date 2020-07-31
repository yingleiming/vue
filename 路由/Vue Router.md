**Vue Router**

**NPM安装：**

```sh
npm install vue-router
```

在一个工程化的项目中，我们通常在`src`文件下单独创建一个`router`文件夹，来保存各类路由的相关配置。如在`router`文件夹下，创建一个`index.js`文件，管理项目的各类路由配置。

```js
import Vue from "vue"
import Router from "vue-router"
Vue.use(Router);
//引入一级路由
import DashBoard from "./../views/dashboard/DashBoard"

//路由懒加载
const Cart = ()=>import("./../views/cart/Cart.vue");
const Category = ()=>import("./../views/category/Category.vue");
const Home = ()=>import("./../views/home/Home.vue");

//用户中心
const Mine = ()=>import("./../views/mine/Mine.vue");
const UserCenter = ()=>import("./../views/mine/children/UserCenter.vue");
const MineOrder = ()=>import("./../views/mine/children/MineOrder.vue");

//引入组件相关
const Order = ()=>import("./../views/order/Order.vue");
const OrderDetail = ()=>import("./../views/order/children/OrderDetail.vue");
const MyAddress = ()=>import("./../views/order/children/MyAddress.vue");
const EditAddress = ()=>import("../views/order/children/children/EditAddress.vue");
const AddAddress = ()=>import("../views/order/children/children/AddAddress.vue");

//引入登陆
const Login = ()=>import("./../views/login/Login.vue");

export default new Router({
    routes:[
        { path:"/",redirect:"/dashboard"},
        {
            path:"/dashboard",
            name:"dashboard",
            component:DashBoard,
            children:[
                {path:"/dashboard",redirect:"/dashboard/home"},
                {path:"home",name:"home",component:Home,meta: { keepAlive: true }},
                {path:"cart",name:"cart",component:Cart},
                {path:"category",name:"category",component:Category,meta: { keepAlive: true }},
                {
                    path:"mine",
                    name:"mine",
                    component:Mine,
                    children:[
                        {path:"userCenter",name:"userCenter",component:UserCenter},//用户中心
                        {path:"mineOrder",name:"mineOrder",component:MineOrder}//我的订单
                    ]
                },
            ]
        },
        {
            path:"/confirmOrder",
            name:"order",
            component:Order,
            children: [
                {
                    path:"myAddress",
                    name:"myAddress",
                    component:MyAddress,
                    children:[
                        {path:"editAddress",name:"editAddress",component:EditAddress},
                        {path:"addAddress",name:"addAddress",component:AddAddress},
                    ]
                },
                {
                    path:"orderDetail",
                    name:"orderDetail",
                    component:OrderDetail,
                },

            ]
        },
        { path:"/login",name:"login",component:Login},
    ]
});

```

然后，我们需要在项目根目录的`main.js`中引入router/index.js文件，并挂载到根元素`#app`上

```js
import Vue from 'vue'
import App from './App.vue'
import router from "./router/index" //引入router/index.js文件
import store from "./store/index"

//1.引用FastClick
import FastClick from "fastclick"
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

//2.引用全局样式
import "./style/common.less"

//3.引入ui组件库-Vant Weapp
import "./plugins/vant"

//4.引入rem
import "./config/rem.js"

//5.引入过滤器
import "./config/filters"

//6.引入二维码生成器插件
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)

new Vue({
  router,//挂载路由
  store,
  render: h => h(App),
}).$mount('#app')
```

在组件中使用路由

```html
<template>
    <div id="dashboard">
        <van-tabbar v-model="active">
            <van-tabbar-item replace to="/dashboard/home">
                <span>首页</span>
                <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.active ? icon.active : icon.inactive"
                >
            </van-tabbar-item>
            <van-tabbar-item replace to="/dashboard/category">
                <span>分类</span>
                <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.active ? icon.active : icon.inactive"
                >
            </van-tabbar-item>
            <van-tabbar-item replace to="/dashboard/cart" :info="goodsNum>0?goodsNum:''">
                <span>购物车</span>
                <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.active ? icon.active : icon.inactive"
                >
            </van-tabbar-item>
            <van-tabbar-item replace to="/dashboard/mine">
                <span>我的</span>
                <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.active ? icon.active : icon.inactive"
                >
            </van-tabbar-item>

        </van-tabbar>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"/>
    </div>
</template>

<script>
    import {mapState,mapMutations,mapActions} from "vuex"
    import {getGoodsCart} from "./../../service/api/index"
    import {setStore} from "../../config/global";
    export default {
        name: "DashBoard",
        data() {
            return {
                active: Number(sessionStorage.getItem("tabBarActiveIndex")) || 0,
                icon: {
                    active: 'https://img.yzcdn.cn/vant/user-active.png',
                    inactive: 'https://img.yzcdn.cn/vant/user-inactive.png'
                }
            }
        },
        // 监视
        watch:{
            active(value){
                this.active = value;
                let tabBarActiveIndex = value>0 ? value: 0;
                sessionStorage.setItem("tabBarActiveIndex",tabBarActiveIndex);

            }
        },
        //计算属性----从vuex中获取的所有数据都放到computed里面
        computed:{
            //取数据
            ...mapState(["shopCart","userInfo"]),
            goodsNum(){
                if(this.shopCart){
                    //总的购物车商品数量
                    let num = 0;
                    // console.log(Object.values(this.shopCart));
                    Object.values(this.shopCart).forEach((goods,index)=>{
                        num += goods.num;
                    });
                    return num;
                }else {
                    return 0;
                }
            }
        },
        methods:{
            ...mapMutations(["INIT_SHOP_CART"]),
            ...mapActions(["reqUserInfo"]),
            async initShopCart(){
                if(this.userInfo.token){//当前用户已经登陆
                    //1.获取当前用户购物车中得商品（服务器端）
                    let result = await getGoodsCart(this.userInfo.token);
                    // console.log(result);
                    //2.如果成功
                    if(result.success_code === 200){
                        let cartArr = result.data;
                        let shopCart = {};
                        //2.1 遍历
                        cartArr.forEach((value)=>{
                            shopCart[value.goods_id] = {
                                "num":value.num,
                                "id":value.goods_id,
                                "name":value.goods_name,
                                "small_image":value.small_image,
                                "price":value.goods_price,
                                "checked":value.checked
                            }
                        });
                        //2.2 本地数据同步
                        setStore({'shopCart':shopCart});//先存储到本地
                        this.INIT_SHOP_CART();
                    }

                }
            }
        },
        mounted(){//此钩子，是页面初始化完毕后调用

            //1.自动登陆
            this.reqUserInfo();

            //2.获取购物车的数据
            this.INIT_SHOP_CART();

            this.initShopCart();
        },

    }

</script>

<style lang="less" scoped>
    #dashboard{
        width: 100%;
        height: 100%;
        background-color: transparent;
    }
    .van-tabbar--fixed{
        /*bottom:1rem*/
    }
</style>
```

