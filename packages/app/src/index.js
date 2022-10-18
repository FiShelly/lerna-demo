import './assets/styles/global.less';
import View from './views/view';

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept();
}

window.onload = () => {
    new View({selector: 'body'});
};
