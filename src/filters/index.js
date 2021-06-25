import Vue from 'vue'
import moment from 'moment'
//切换moment语言
moment.locale('zh-cn')
Vue.filter('formatDateFromNow',(dataStr)=>{
  // console.log(dataStr);
  return moment(dataStr).format()
})
