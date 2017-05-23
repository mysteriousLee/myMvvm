## 一个简单的MVVM框架(仿照vue1.0版本)
## 目前功能
* lulu-text
* lulu-show
* lulu-model
* lulu-for

## 技术实现
### 核心内容为数据与视图的双向绑定,基于ES5中的defineProperty()来实现的,通过检测数据的变化来通知对应的视图来进行变更。详细内容请看这篇博客
http://blog.csdn.net/shenmill/article/details/65441260

### 双向绑定

* compile 
* pasers
* observe
* render

#### compile
#### 遍历所有元素节点将它们存储到一个cache数组中

#### pasers
#### 对每个元素的节点的指令进行解析,绑定相应的数据和事件函数

#### observe
#### 实现一个观察者模式,基于defineProperty()方法,对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者

#### render
#### 收到发布者的消息后进行视图的渲染,v-model和v-text是直接将最新的data赋给元素节点的value,v-show通过改变display的block和none来实现。

### 具体使用
#### html部分

```javascript
<div id="message">
        <h1 lulu-text="title"></h1>
        <span lulu-show="show">看不见我看不见我</span>
        <h1 lulu-text="message"></h1>
        <p lulu-for="item in list">
            <span>{{ item.name }}</span>
            <span>{{ item.age }}</span>
        </p>    
        <ul>
            <li lulu-for="item in list">
                {{ item.hobby }}
            </li>
        </ul>
        <div class="mouseDiv" lulu-on:mouseover="mouseEvent"></div>
        <input type="text" lulu-model="message"/>
        <input type="button" value="点我呀" lulu-on:click="clickEvent">
    </div>
```

#### js部分

```javascript
new mvvm({
            el:'#message',
            data: {
                title: '简单的mvvm框架',
                show: false,
                message: 123123123,
                list: [
                    { name: 'lulu',age: 20,hobby: 'soccer'},
                    { name: 'tom',age: 21,hobby: 'basketball'},
                    { name: 'lucy',age: 22,hobby: 'swimming'},
                    { name: 'susan',age: 20,hobby: 'pingpang'}
                ]
            },
            methods: {
                clickEvent: function(){
                    alert('hahaha');
                },
                mouseEvent: function(){
                    alert('lalala');
                }
            }
    });
```

### 后续功能持续开发中...

