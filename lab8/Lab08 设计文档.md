## Lab08 设计文档

姓名：俞晓莉

学号：18307130274



### 任务一

首先通过querySelector()获取轮播组件及左右切换按钮，方便后续进行相应的绑定。

由于wrap是绝对定位的，所以控制轮播组件显示图片是通过修改left属性的值来绑定相应的图片。

这边要注意的是有一个边界情况的处理，即第五张图片后（位置6）后的第一张图片（位置7），再点击next按钮后应当跳转到第二张图片（位置3）。代码如下：

```js
    if(wrap.style.left === "-3600px"){
        nextPic = -1200;
    }else{
        nextPic = parseInt(wrap.style.left)-600;
    }
```

对前一张图片按钮的处理也类似，第一张图片（位置2）的前一张第五张图片（位置1）点击pre按钮后应当跳转到第四张图片（位置5）。代码如下：

```js
if(wrap.style.left === "0px"){
    prePic = -2400;
}else{
    prePic = parseInt(wrap.style.left)+600;
}
```

然后是对应的数值的切换。

设置当前下标index为全局变量。点击pre和next按钮分别对index进行--和++操作，并注意边界的处理情况（index的值4后是0，0后是4），通过span获取所有下标，给index下标的span绑定on这个class，就可以将其变成红色。

整题代码如下：

```js
/*Global Variable Area */
let index = 0;
let count = document.getElementsByTagName("span");
/*Global Variable Area End */
let wrap = document.querySelector(".wrap");
let next = document.querySelector(".arrow_right");
let prev = document.querySelector(".arrow_left");

next.onclick = function () {
    let nextPic;
    /* 处理边界图片 */
    if(wrap.style.left === "-3600px"){
        nextPic = -1200;
    }else{
        nextPic = parseInt(wrap.style.left)-600;
    }
    wrap.style.left = nextPic + "px";
    index++;
    if(index > 4){
        index = 0;
    }
    for(var i = 0; i < count.length; i++){
        count[i].className = "";
    }
    count[index].className = "on";
}

prev.onclick = function () {
    var prePic;
    /* 处理边界图片 */
    if(wrap.style.left === "0px"){
        prePic = -2400;
    }else{
        prePic = parseInt(wrap.style.left)+600;
    }
    wrap.style.left = prePic + "px";
    index--;
    if(index < 0){
        index = 4;
    }
    for(var i = 0; i < count.length; i++){
        count[i].className = "";
    }
    count[index].className = "on";
}
```



### 任务二

设置定时播放就是引入setInterval()和clearInterval()。然后为他们分别设置鼠标悬停时间，设置移入轮播图clearInterval，移出仍旧自动播放。

代码如下：

```js
let time = null;
let container = document.querySelector(".container");
function play () {
    time = setInterval(function () {
        let nextPic;
        /* 处理边界图片 */
        if(wrap.style.left === "-3600px"){
            nextPic = -1200;
        }else{
            nextPic = parseInt(wrap.style.left)-600;
        }
        wrap.style.left = nextPic + "px";
        index++;
        if(index > 4){
            index = 0;
        }
        for(let i = 0; i < count.length; i++){
            count[i].className = "";
        }
        count[index].className = "on";
    },500 * 2);
}
window.onload = play();
container.onmouseenter = function () {
    clearInterval(time);
}
container.onmouseleave = function () {
    play();
}
```



### 任务三

通过点击span改变图片的主要逻辑是要能够获得当前span对应的下标值和需要转换的下标，并将wrap的相应left设置为与index对应的600倍数即可（同时要对index的边界情况进行处理）。

代码如下：

```js
for (let i = 0; i < count.length ; i++){
    (function(i){
        count[i].onclick = function () {
            let now = index - i;
            /* 处理边界图片 */
            if(index == 4 && parseInt(wrap.style.left)!==-3000){
                now = now - 5;
            }
            if(index == 0 && parseInt(wrap.style.left)!== -600){
                now = now + 5;
            }
            wrap.style.left = (parseInt(wrap.style.left) +  now * 600)+"px";
            index = i;
            for(let j = 0; j < count.length; j++){
                count[j].className = "";
            }
            count[index].className = "on";
        }
    })(i);
}
```



### 任务四

通过jquery实现，主要思路是，先给table的每个单元格td设置click事件，事件内将td换成input这个html，并给input设置width和height让其显示在原先的td内，blur事件则直接设置td的值为之前输入的内容即可。

代码如下：

```js
$('table td').bind("click",function(){
    /* 点击后新增一个input输入框，初始值为td内原来的值 */
    let newInput = $("<input type='text' value='"+ $(this).text() +"'/>");
    $(this).html(newInput);
    newInput.focus();
    /* 失去焦点后，input重新变为td的text */
    newInput.blur(function(){
        newInput.parent().html(newInput.val());
    });
});
```