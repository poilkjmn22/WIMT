import WIMTList from '../vue/WIMTList'
import Index from '../vue/Index'
const routes = [{
  path: '/',
  redirect: '/list'
},{
    path: '/',
    name: 'index',
    component: Index,
    children: [{
        path: '/list',
        name: 'list',
        component: WIMTList
    }]
}]

export default routes
