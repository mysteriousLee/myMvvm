## 一个简单的MVVM框架(仿照vue1.0版本)
## 目前功能
* lulu-text
* lulu-show
* lulu-model
* lulu-for
* lulu-on:...(绑定事件)

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

### 具体实现了一个todolist
#### html部分

```javascript
<div id="message">
        <h1 lulu-text="message"></h1>
        <span lulu-show="show">看不见我看不见我</span>
        <ul>
            <li lulu-for="item in list" lulu-on:click="removeElement">
                {{ item.name }}
            </li>
        </ul>
        <input type="text" lulu-model="message"/>
        <input type="button" value="点我呀" lulu-on:click="clickEvent">
</div>
```

#### js部分

```javascript
new mvvm({
            el:'#message',
            data: {
                message: '这是一个todolist',
                show: false,
                list: [
                    { name: 'lulu'},
                    { name: 'tom'},
                    { name: 'lucy'},
                    { name: 'susan'}
                ]
            },
            methods: {
                clickEvent: function(){
                    var newObj = {};
                    newObj.name = this.data.message;
                    this.data.list.push(newObj);
                    var name = 'list';
                    this.render(name);
                },
                removeElement: function(){
                    var childNodes = event.target.parentNode.childNodes;
                    for(var i = 0;i < childNodes.length; i++){
                        if(event.target == childNodes[i]){
                            this.data.list.splice(i,1);
                            var name = 'list';
                            this.render(name);
                            i--;
                        }
                    }  
                }
            }
    });
```
### 功能
#### 点击button可以将input框里的内容加入到list列表中并且渲染出来,点击对应列表项可以将该项从列表中删除,不过实现方面还需要改进,js代码部分看起来好繁琐,还有render部分不够主动...
### 后续功能持续开发中...

