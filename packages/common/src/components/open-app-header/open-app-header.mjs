import $ from 'jquery';
import Component from '../component.mjs';
import ejsTemplate from './template.ejs';
import './style.less';

export class OpenAppHeader extends Component {

    static get name () {
        return 'OpenAppHeader';
    }

    constructor (props) {
        console.log('props:', props, $);
        super(props);
        this.render();
    }

    template () {
        return ejsTemplate(this.props);
    }

}

