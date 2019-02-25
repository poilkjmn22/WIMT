import WIMTList from '../vue/WIMTList'
import AddActivity from '../vue/AddActivity'
import Index from '../vue/Index'
const routes = [{
    path: '/',
    redirect: '/list',
    name: 'index',
    component: Index,
    children: [{
        path: 'list',
        name: 'list',
        component: WIMTList
    },{
        path: 'add-activity',
        name: 'addActivity',
        component: AddActivity
    }]
}]

export default routes
