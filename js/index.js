var arr = []; //用于存放通过浮动布局各个图片块的位置（x，y坐标）
var izIndex = 2; //用于控制拖拽的那个图片的层级，不然会被其他图片覆盖
var oLi = null;
var oIndex = -1;
var liArr = [];//用于存放发声碰撞的元素的下标
window.onload = function(){
  // 先在css中用浮动限制，然后用js实现批量控制为绝对定位，有利于拖拽后的位置处理
  oLi = document.getElementsByTagName("li");
  var oBtn = document.getElementById("btn");
  for (var i = 0; i < oLi.length; i++) {
    arr.push([oLi[i].offsetLeft,oLi[i].offsetTop]);
  }
  for (var i = 0; i < oLi.length; i++) {
    oLi[i].style.position = 'absolute';
    oLi[i].style.left = arr[i][0] + 'px';
    oLi[i].style.top = arr[i][1] + 'px';
    oLi[i].style.margin = 0;
    drag(oLi[i],i);
  }
}

function drag(obj,index){ //拖拽-------------------------------------------
  var disX = 0,
      disY = 0;
  obj.onmousedown = function(ev){
    obj.style.zIndex = izIndex++;
    var ev = ev||window.event;
    disX = ev.clientX - obj.offsetLeft;
    disY = ev.clientY - obj.offsetTop;
    document.onmousemove = function(ev){
      obj.style.transition = '0s';
      var ev = ev||window.event;
      obj.style.left = ev.clientX - disX + 'px';
      obj.style.top = ev.clientY - disY + 'px';
      liArr.length = 0;
      //遍历各个li元素，检测哪个元素（除obj自身外）与obj有碰撞
      for (var i = 0; i < oLi.length; i++) {
        oLi[i].style.border = '';
        if(pz(obj,oLi[i])&&obj!=oLi[i]){ //检测到有碰到的
          liArr.push(i);
        }
      }
      // 如果存在与目标元素碰撞的元素
      if(liArr.length){
        // 在碰撞到的各个元素中找出距离拖拽元素最近的
        var liArrLength = [];
        for (var i = 0; i < liArr.length; i++) {
          liArrLength.push(getThirdValue(oLi[liArr[i]],obj));
        }
        var minIndex = findMin(liArrLength);
        oIndex = liArr[minIndex];
        oLi[oIndex].style.border = "2px solid #f00";
      }
    }
    document.onmouseup = function(){
      if(liArr.length){
        // 释放鼠标时，位置交换
        oLi[oIndex].style.left = arr[index][0]+'px';
        oLi[oIndex].style.top = arr[index][1]+'px';
        obj.style.left = arr[oIndex][0]+'px';
        obj.style.top = arr[oIndex][1]+'px';
        oLi[oIndex].style.transition = obj.style.transition = 'left .3s,top .3s';
        oLi[oIndex].style.border = '';
        var temp = null;
        temp = arr[index];
        arr[index] = arr[oIndex];
        arr[oIndex] = temp;
        liArr.length = 0;
      }
      else {
        // 没有和任何其他图片有交集
        obj.style.left = arr[index][0]+'px';
        obj.style.top = arr[index][1]+'px';
        obj.style.transition = 'left .3s,top .3s';
      }
      document.onmousemove = null;
      document.onmouseup = null;
    }
    return false;
  }
}
function pz(obj1,obj2){ //碰撞检测函数-----------------------------------
  var L1 = obj1.offsetLeft, //obj1左偏移量
      R1 = obj1.offsetLeft+obj1.offsetWidth, //obj1左偏移量+宽度
      T1 = obj1.offsetTop, //obj1顶部偏移量
      B1 = obj1.offsetTop+obj1.offsetHeight; //obj1顶部偏移量+高度
  var L2 = obj2.offsetLeft,
      R2 = obj2.offsetLeft+obj1.offsetWidth,
      T2 = obj2.offsetTop,
      B2 = obj2.offsetTop+obj2.offsetHeight;
  if(R1<L2 || L1>R2 || B1<T2 || T1>B2){
    return false; //没碰到
  }
  return true; //碰到了
}
function findMin(arr){ //找出最小数--------------------------------------
  var value = 10000, //设置一个很大的数，用于和数组中的各个数进行比较
      index = -1; //用于存放最小数的那个数的数组下标
  for (var i = 0; i < arr.length; i++) {
    if(arr[i]<value){
      value = arr[i];
      index = i;
    }
  }
  return index;
}
function getThirdValue(obj1,obj2){ //勾股定理求第三边----------------------
  var a = obj1.offsetLeft - obj2.offsetLeft,
      b = obj1.offsetTop - obj2.offsetTop;
  return Math.sqrt(a*a+b*b);
}
