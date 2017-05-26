function mvvm(params) {
    myMvvm.init(params);
}
var myMvvm = {
    el: null,
    data: null,
    methods: null,
    cache: [],
    init: function (params) {
        this.el = document.querySelector(params.el);
        this.data = params.data;
        this.methods = params.methods;
        this.compile(this.el);
        this.pasers();
        this.observe();
        this.render();
    },
    compile: function (nodes) {
        if (nodes.nodeType == 1) {
            this.cache.push(nodes);
            if (nodes.hasChildNodes()) {
                nodes.childNodes.forEach(function (item) {
                    this.compile(item);
                }, this);
            }
        }
    },
    pasers: function () {
        this.cache = this.cache.map(function (node) {
            return this.paserNode(node);
        }, this);
        console.log(this.cache);
    },
    paserNode: function (node) {
        var text = node.getAttribute('lulu-text');
        var show = node.getAttribute('lulu-show');
        var model = node.getAttribute('lulu-model');
        var lufor = node.getAttribute('lulu-for');
        var temp = {
            node: node
        };
        if (text) {
            temp.text = text;
        }
        else if (show) {
            temp.show = show;
        }
        else if (model) {
            if(!this.data.hasOwnProperty(model)){
                this.data[model] = '';
            }
            temp.model = model;
            node.addEventListener('input', this.onChange.bind(this, model), false);
        }
        else if (lufor) {
            temp.list = lufor.split(' ')[2];
            temp.item = [];
            temp.parentNode = node.parentNode;
            if(node.childNodes.length > 1){
                for(var i = 0;i < node.childNodes.length; i++){
                    if(node.childNodes[i].nodeName !== '#text'){
                        var itemObj = {};
                        itemObj.tag = node.childNodes[i].nodeName.toLowerCase();
                        itemObj.text = this.returnItem(node.childNodes[i].innerText);
                        temp.item.push(itemObj);
                    }
                }
            } else{
                var itemObj = {};
                itemObj.tag = '';
                itemObj.text = this.returnItem(node.childNodes[0].data);
                temp.item.push(itemObj);
            }  
        }
        temp = this.appendEvent(temp);
        return temp;
    },
    appendEvent: function(temp){
        var node = temp.node;
        temp.event = [];
        var allAttributes = node.attributes;
        for(var i = 0;i < allAttributes.length; i++){
            var reg = /^lulu-on:|^@/;
            var attrName = allAttributes[i].name;
            if(attrName.match(reg)){
                var bindEvent = {};
                bindEvent.name = attrName.split(':')[1];
                bindEvent.function = allAttributes[i].value;
                temp.event.push(bindEvent);
                node.addEventListener(bindEvent.name,this.methods[bindEvent.function].bind(this),false);
            }
        }
        return temp;
    },
    onChange: function (attr) {
        this.data[attr] = event.target.value;
    },
    returnItem: function(text) {
        var reg = /\{{(.*)\}}/;
        var str = text.match(reg)[1];
        str = str.trim().split('.');
        var newStr = [];
        for(var j = 1;j < str.length; j++){
            newStr.push(str[j]);
        }
        newStr = newStr.join('.');
        return newStr;
    },
    judgeNull: function (value) {
        if (value === undefined || value === null || value === '') {
            return false;
        }
        return true;
    },
    bindEvent: function(item,child){
        if(item.event.length > 0) {
            for(var i = 0;i < item.event.length; i++){
                child.addEventListener(item.event[i].name,this.methods[item.event[i].function].bind(this),false);
            }
        }
        return child;
    },
    render: function (prop) {
        if(prop){
                this.cache.forEach(function (item) {
                if (this.judgeNull(item.text) && item.text == prop) {
                    item.node.textContent = this.data[item.text] || '';
                    return;
                }
                if (this.judgeNull(item.show) && item.show == prop) {
                    var value;
                    if (this.data[item.show]) {
                        value = 'block';
                    } else {
                        value = 'none';
                    }
                    item.node.style.display = value;
                    return;
                }
                if (this.judgeNull(item.model) && item.model == prop) {
                    item.node.value = this.data[item.model] || '';
                    return;
                }
                if (this.judgeNull(item.list) && item.list == prop) {
                    var dataNode = this.data[item.list];
                    item.parentNode.innerHTML = '';
                    for(var i = 0;i < dataNode.length; i++){
                        var localNode = document.createElement(item.node.localName);
                        for(var j = 0;j < item.item.length; j++){
                            if(item.item[j].tag != '') {
                                var localChild = document.createElement(item.item[j].tag);
                                localChild.innerHTML = dataNode[i][item.item[j].text];
                                localNode.appendChild(localChild);
                            }else{
                                localNode.innerHTML = dataNode[i][item.item[j].text];
                            }    
                        }
                        localNode = this.bindEvent(item,localNode);  
                        item.parentNode.appendChild(localNode);
                    }
                    return;
                }
            }, this);
        } else {
            this.cache.forEach(function (item) {
                if (this.judgeNull(item.text)) {
                    item.node.textContent = this.data[item.text] || '';
                }
                if (this.judgeNull(item.show)) {
                    var value;
                    if (this.data[item.show]) {
                        value = 'block';
                    } else {
                        value = 'none';
                    }
                    item.node.style.display = value;
                }
                if (this.judgeNull(item.model)) {
                    item.node.value = this.data[item.model] || '';
                }
                if (this.judgeNull(item.list)) {
                    var parentNode = item.node.parentNode;
                    var dataNode = this.data[item.list];
                    parentNode.innerHTML = '';
                    for(var i = 0;i < dataNode.length; i++){
                        var localNode = document.createElement(item.node.localName);
                        for(var j = 0;j < item.item.length; j++){
                            if(item.item[j].tag != '') {
                                var localChild = document.createElement(item.item[j].tag);
                                localChild.innerHTML = dataNode[i][item.item[j].text];
                                localNode.appendChild(localChild);
                            }else{
                                localNode.innerHTML = dataNode[i][item.item[j].text];
                            } 
                        }
                        localNode = this.bindEvent(item,localNode);  
                        parentNode.appendChild(localNode);
                    }
                }
            }, this);
        }
    },
    observe: function () {
        var that = this;
        Object.keys(this.data).forEach(function (prop) {
            var val = that.data[prop];
            Object.defineProperty(that.data, prop, {
                get: function () {
                    return val;
                },
                set: function (newVal) {
                    var temp = val;
                    val = newVal;
                    that.render(prop);   
                }
            });
        });
    }
};