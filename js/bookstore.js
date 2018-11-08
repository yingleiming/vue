

window.onload=function () {
   new Vue({
       el:"#app",
       data:{
           bookList:[
               {name:"node.js",price:38.8,count:2},
               {name:"jquery.js",price:25.4,count:4},
               {name:"angular.js",price:68.3,count:3},
               {name:"vue.js",price:108.0,count:12},
               {name:"react.js",price:38.3,count:3},
               {name:"lay.js",price:20.5,count:7},
           ],
           addList:{
               name:'',
               price:'',
               count:''
           }
       },
       methods:{
           reduce:function (book) {
               // vue2.0 开始移除$remove方法,用splice()代替
               this.bookList.splice(book,1);
           },
           add:function () {
               this.bookList.push(this.addList);
               this.addList={
                   name:'',
                   price:'',
                   count:''
               }
           }

       },
       computed:{
           total:function () {
               var sum = 0;
               this.bookList.forEach(function(item){
                    sum += (item.price)*(item.count);
                   }
               );
               return sum;
           }
       }
   });








}