var videochatroom=document.getElementById('videochatroom');
var users=$('#users');
var usersmap={};
var usersmapsize=0;
$("#loginbutton").click(
  function(){
    $("#loginpage").hide();
    $("#videochatroom").show();
    $("#sendinput")[0].focus();
    creatlocalvideocontainer();
    $('#users').val($('#username')[0].value);
    var remotes=document.createElement('div');
    remotes.setAttribute('id','remotes');
    videochatroom.appendChild(remotes);
    // grab the room from the URL
    var room = location.search && location.search.split('?')[1];
    //var room =$("#roomname")[0].value;
    // create our webrtc connection
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localvideo',
       // the id/element dom element that will hold remote videos
       remoteVideosEl: '',
       // immediately ask for camera access
       autoRequestMedia: true,
       debug: false,
       detectSpeakingEvents: true,
       autoAdjustMic: false
    });
    // when it's ready, join if we got a room from the URL
    webrtc.on('readyToCall', function () {
        // you can name it anything	
        if (room) 	webrtc.joinRoom(room);
        webrtc.adduserslist();
    });
    
    function showVolume(el, volume) {
               if (!el) return;
               if (volume < -45) { // vary between -45 and -20
                   el.style.height = '10px';
               } else if (volume > -20) {
                   el.style.height = '100%';
               } else {
                   el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
                }
           }
    webrtc.on('channelMessage', function (peer, label, data) {
               if (data.type == 'volume') {
                   showVolume(document.getElementById('volume_' + peer.id), data.volume);
               }
               if (data.type == 'chat') {
               $('#messages').val($('#messages')[0].value+data.payload+'\n');  
               $('#messages').scrollTop($("#messages")[0].scrollHeight);             
               }
           });
    
    webrtc.on('videoAdded', function (video, peer) {
               console.log('video added', peer);             
               if (remotes) {
               
			        webrtc.webrtc.sendToAll('nickname',$('#username')[0].value);                    
                    var d = document.createElement('div');
                    d.className = 'videocontainer';
                    usersmapsize++;
                    //定位从上往下优先
                    //var top=(usermapsize%2)*210+38;
                    //var left=Math.floor((usermapsize)/2)*250+15;
                    //从左到右优先
					
                    var top=Math.floor(usersmapsize/3)*210+38;
                    var left=(usersmapsize)%3*250+15;
                    var position='top:'+top.toString()+'px;left:'+left.toString()+'px';
                    d.setAttribute('style',position);
                    
                    d.id = 'container_' + webrtc.getDomId(peer);
                    
                    //
                    
                    var videotitlebutton1=document.createElement('input');    
                    videotitlebutton1.setAttribute('type','button');
                    videotitlebutton1.setAttribute('class','videotitlebutton');
                    videotitlebutton1.setAttribute('style','right:20%');
                    videotitlebutton1.value='-';
                    videotitlebutton1.onclick=function small(){
                        d.setAttribute('style','height:200px;width:240px');
                    }
                    var videotitlebutton2=document.createElement('input');
                    videotitlebutton2.setAttribute('type','button');
                    videotitlebutton2.setAttribute('class','videotitlebutton');
                    videotitlebutton2.setAttribute('style','right:10%');
                    videotitlebutton2.value='+';
                    videotitlebutton2.onclick=function big(){
                        d.setAttribute('style','height:400px;width:480px');
                    }
                    var videotitlebutton3=document.createElement('input');
                    videotitlebutton3.setAttribute('type','button');
                    videotitlebutton3.setAttribute('class','videotitlebutton');
                    videotitlebutton3.setAttribute('style','right:0');
                    videotitlebutton3.value='X';
                    videotitlebutton3.onclick=function close(){
                        d.setAttribute('style','height:40px;width:80px');
                    }               
                    //
                    video.style.width='100%';
                    video.style.height='90%';
                    var vol = document.createElement('div');
                    vol.id = 'volume_' + peer.id;
                    vol.className = 'volume_bar';
                    var videotitle=document.createElement('div');
                    videotitle.id='videotitle_'+peer.id;
                    videotitle.setAttribute('class','videotitle');
                    d.appendChild(videotitlebutton1);
                    d.appendChild(videotitlebutton2);
                    d.appendChild(videotitlebutton3);
                    d.appendChild(videotitle);
                    d.appendChild(video);
                    d.appendChild(vol);           
                    remotes.appendChild(d);
                    webrtc.updateuserslist();                    
                }
            });
      webrtc.on('videoRemoved', function (video, peer) {
            console.log('video removed ', peer);
            var remotes = document.getElementById('remotes');
            var el = document.getElementById('container_' + webrtc.getDomId(peer));
            if (remotes && el) {
                remotes.removeChild(el);                
                webrtc.updateuserslist(); 
               }
            });
      webrtc.on('volumeChange', function (volume, treshold) {
           //console.log('own volume', volume);
           showVolume(document.getElementById('localVolume'), volume);
         });

        // Since we use this twice we put it here
        function setRoom(name) {
            $('#messages').val('Link to join: ' + location.href+'\n');
            $('body').addClass('active');
        }

        if (room) {
           setRoom(room);
            } else {
                    var val = $('#roomname').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
                    webrtc.createRoom(val, function (err, name) {
                        console.log(' create room cb', arguments);
                    
                        var newUrl = location.pathname + '?' + name;
                        if (!err) {
                            history.replaceState({foo: 'bar'}, null, newUrl);
                            setRoom(name);
                        } else {
						    if (err === 'taken'){
							  alert('Room Name have been taken.Need another Room Name.')
							}
                            console.log(err);
                        }
                      });       
                    }

            
			$("#sendinput").keyup(
			function(){
			if (event.keyCode==13){
			var message=$("#sendinput")[0].value;
			message=$("#messages")[0].value+$('#username')[0].value+" :"+message+"\n";					
			webrtc.sendchat('simplewebrtc','chat',$('#username')[0].value+" :"+$("#sendinput")[0].value);
			$("#messages").val(message);
			$('#messages').scrollTop($("#messages")[0].scrollHeight);
			$("#sendinput").val("");
			}
			})
			
			webrtc.on('onlinelist',function(payload){
			    var userlist="";
			    for (var i in payload){
			    	userlist=userlist+i+'\n';
			    		};
			    $('#users').val(userlist);
			 });
			 window.onbeforeunload = function(){
			 webrtc.removeuserslist();	 
			 }
			 setInterval(function(){
			                for (var i in usersmap){
			                        var title=document.getElementById('videotitle_'+i);
			                        if (title) title.innerHTML=usersmap[i];
                                };
                        },2000);
			    
  }
)


function creatlocalvideocontainer(){
    
    var localvideocontainer=document.createElement('div');
    localvideocontainer.setAttribute('class','videocontainer');
    localvideocontainer.setAttribute('id','localvideocontainer');
    var localvideotitle=document.createElement('div');
    localvideotitle.setAttribute('class','videotitle');
    var username=$("#username")[0].value;
    localvideotitle.innerHTML=username;
    var localvideotitlebutton1=document.createElement('input');    
    localvideotitlebutton1.setAttribute('type','button');
    localvideotitlebutton1.setAttribute('class','videotitlebutton');
    localvideotitlebutton1.setAttribute('style','right:20%');
    localvideotitlebutton1.value='-';
    localvideotitlebutton1.onclick=function small(){
        localvideocontainer.setAttribute('style','height:200px;width:240px');
    }
    var localvideotitlebutton2=document.createElement('input');
    localvideotitlebutton2.setAttribute('type','button');
    localvideotitlebutton2.setAttribute('class','videotitlebutton');
    localvideotitlebutton2.setAttribute('style','right:10%');
    localvideotitlebutton2.value='+';
    localvideotitlebutton2.onclick=function big(){
        localvideocontainer.setAttribute('style','height:400px;width:480px');
    }
    var localvideotitlebutton3=document.createElement('input');
    localvideotitlebutton3.setAttribute('type','button');
    localvideotitlebutton3.setAttribute('class','videotitlebutton');
    localvideotitlebutton3.setAttribute('style','right:0');
    localvideotitlebutton3.value='X';
    localvideotitlebutton3.onclick=function close(){
    localvideocontainer.setAttribute('style','height:40px;width:80px');
    }
    var localvideo=document.createElement('video');
    localvideo.setAttribute('id','localvideo');
    localvideo.setAttribute('class','video');
    localvideo.setAttribute('autoplay','autoplay');
    localvideotitle.appendChild(localvideotitlebutton1);
    localvideotitle.appendChild(localvideotitlebutton2);
    localvideotitle.appendChild(localvideotitlebutton3);
    var localVolume=document.createElement('div');
    localVolume.setAttribute('id','localVolume');
    localVolume.setAttribute('class','volume_bar');
    localVolume.setAttribute('width','10%');
    localvideocontainer.appendChild(localvideotitle);
    localvideocontainer.appendChild(localvideo);
    localvideocontainer.appendChild(localVolume);
    videochatroom.appendChild(localvideocontainer);
    }
