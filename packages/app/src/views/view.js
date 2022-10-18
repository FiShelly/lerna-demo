import $ from 'jquery';
import { Component, OpenAppHeader } from '@lerna-demo/common';

export default class View extends Component {
    constructor (props) {
        super(props);
    }

    init () {
        this.components = {
            [OpenAppHeader.name]: new OpenAppHeader({title: '首页头条首页头条首页头条首页头条首页测试一下头条首页头条'})
        };

        if (window.location.href.includes('isApp')) {
            $('body').css('padding-top', '12vw');
        }
    }

}
