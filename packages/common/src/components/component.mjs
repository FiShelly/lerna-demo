export default class Component {
    constructor (props = {}) {
        this.props = props;
        this.$parent = $(props.parent || 'body');
        this.components = {};
        this.name = this.props.name;
        this.init();
        this.bindEvent();
        this._callMounted();
    }

    init () {
        this.$el = $(this.template());
    }

    bindEvent () {}

    on (...args) {
        this.$el.on(...args);
    }

    off (...args) {
        this.$el.off(...args);
    }

    template () {
    }

    render () {
        this.$parent.append(this.$el);
    }

    update () {}

    mounted () {}

    _callMounted () {
        Object.values(this.components).forEach(el => el.mounted && el.mounted());
    }
}
