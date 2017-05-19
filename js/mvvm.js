function mvvm(params) {
	myMvvm.init(params);
}
var myMvvm = {
	el: null,
	data: null,
	cache: [],
	init: function (params) {
		this.el = document.querySelector(params.el);
	    this.data = params.data;
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
    },
    paserNode: function (node) {
        var text = node.getAttribute('lulu-text');
        var show = node.getAttribute('lulu-show');
        var model = node.getAttribute('lulu-model');
        var temp = {
            node: node
        };
        if (text) {
            temp.text = text;
        }
        if (show) {
            temp.show = show;
        }
        if (model) {
            if(!this.data.hasOwnProperty(model)){
                this.data[model] = '';
            }
            temp.model = model;
            node.addEventListener('input', this.onchange.bind(this, model), false);
        }
        return temp;
    },
    onchange: function (attr) {
        this.data[attr] = event.target.value;
    },
    judgeNull: function (value) {
        if (value === undefined || value === null || value === '') {
            return false;
        }
        return true;
    },
    render: function () {
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
        }, this);
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
                    that.render();
                }
            });
        });
    }
};