import WIMTList from '../vue/WIMTList'
import AddActivity from '../vue/AddActivity'
import AddActivitySchedule from '../vue/AddActivitySchedule'
import EditActivity from '../vue/EditActivity'
import D3Charts from '../vue/D3Charts'
import D3Demos from '../vue/D3Demos'
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
    },{
        path: 'add-activity-schedule',
        name: 'addActivitySchedule',
        component: AddActivitySchedule
    },{
        path: 'edit-activity/:activitydate',
        name: 'editActivity',
        component: EditActivity
    },{
        path: 'd3-charts',
        name: 'd3Charts',
        component: D3Charts
    },{
        path: 'd3-demos',
        name: 'd3Demos',
        component: D3Demos
    }]
}]

export default routes
