import Index from '../vue/Index'
import WIMTList from '../vue/WIMTList'
const routes = [{
    path: '/',
    name: 'index',
    redirect: '/list',
    component: Index,
    children: [{
        path: '/list',
        name: 'list',
        component: WIMTList
    }]
}]

export default routes
