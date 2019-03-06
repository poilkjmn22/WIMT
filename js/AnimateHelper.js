import raf from 'raf';
function now(){
  return (+new Date());
}
const AnimateHelper = {
  setTimeoutEffectively(cb, duration){
    let lastTime = now();
    let delay = 0;
    function loop(){
      if(delay < duration){
        delay += (now() - lastTime);
        lastTime = now();
        raf(loop);
      }else{
        cb();
      }
    }
    loop();
  }
};
export default AnimateHelper;
