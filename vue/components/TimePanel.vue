<template lang="html">
  <div class="time-panel">
    <div class="HMS">
      {{hours}}:{{minutes}}:{{seconds}}
    </div>
    <div class="seperate-line">
      &nbsp;
    </div>
    <div class="YMD">
      <div class="day">{{day}}</div>
      <div>{{year}}.{{month}}.{{date}}</div>
    </div>
  </div>
</template>

<script>
const localDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const padNum = function(num){
  return num < 10 ? ('0' + num) : num;
};
export default {
  data(){
    return {
      now: new Date()
    };
  },
  computed: {
    year(){
      return this.now.getFullYear()
    },
    month(){
      return padNum(this.now.getMonth() + 1);
    },
    date(){
      return padNum(this.now.getDate());
    },
    day(){
      return localDays[this.now.getDay()];
    },
    hours(){
      return padNum(this.now.getHours());
    },
    minutes(){
      return padNum(this.now.getMinutes());
    },
    seconds(){
      return padNum(this.now.getSeconds());
    }
  },
  mounted(){
    var vm = this;
    function loopUpdateTime(){
      var id = setTimeout(function(){
        clearTimeout(id);
        vm.now = new Date();
        loopUpdateTime();
      }, 1000);
    }
    loopUpdateTime();
  }
}
</script>

<style lang="css">
.time-panel{
  color: #9FC3EE;
  text-align: left;
}
.time-panel .seperate-line{
  width: 2px;
  height: 32px;
  background-color: #9FC3EE;
}
.time-panel .HMS{
  font-size: 36px;
}
.time-panel > *{
  vertical-align: middle;
  display: inline-block;
  font-weight: 600;
  margin-right: 15px;
}
.time-panel .YMD{
  font-size: 16px;
}
</style>
