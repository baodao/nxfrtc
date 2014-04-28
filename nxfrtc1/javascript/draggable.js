var Dragging=function(validateHandler){ //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
var draggingObj=null; //dragging Dialog
var diffX=0;
var diffY=0; 
function mouseHandler(e){
     switch(e.type){
          case 'mousedown':
          draggingObj=validateHandler(e);//验证是否为可点击移动区域
          if(draggingObj!=null){
          diffX=e.clientX-draggingObj.offsetLeft;
          diffY=e.clientY-draggingObj.offsetTop;
          }
          break;
                        
          case 'mousemove':
          if(draggingObj){
              draggingObj.style.left=(e.clientX-diffX)+'px';
              draggingObj.style.top=(e.clientY-diffY)+'px';
              }
              break;
                        
          case 'mouseup':
          draggingObj =null;
          diffX=0;
          diffY=0;
          break;
          }
          };
                
          return {
          enable:function(){
          document.addEventListener('mousedown',mouseHandler);
          document.addEventListener('mousemove',mouseHandler);
          document.addEventListener('mouseup',mouseHandler);
          },
          disable:function(){
          document.removeEventListener('mousedown',mouseHandler);
          document.removeEventListener('mousemove',mouseHandler);
          document.removeEventListener('mouseup',mouseHandler);
          }
          }
          }

          function getDraggingDialog(e){
          var target=e.target;
          while(target && target.className.indexOf('videotitle')==-1){
             target=target.offsetParent;
          }
          if(target!=null){
             return target.offsetParent;
             }else{
                  return null;
              }
           }
            
Dragging(getDraggingDialog).enable();