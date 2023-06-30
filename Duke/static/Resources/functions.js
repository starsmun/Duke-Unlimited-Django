var questions = []
var loop = 9;

$(document).ready(async function() {
    questions = JSON.parse(await getData('../get_questions'));
    setValues(questions[9-loop]);
    $('#SlideUpBar h1').text(questions[9-loop]['answer']);
    setTimeout(() => moveLogo('DOWN'), 500);
    setTimeout(moveTextUp, 1500);
    loadYouTubeIframeAPI();
});


function getData(url) {
	return new Promise((resolve, reject) => {
		const inputRequest = new XMLHttpRequest();
		inputRequest.open("GET", url , true);
		inputRequest.onload = () => resolve(inputRequest.responseText);
		inputRequest.send();
	});
}

async function countdown(){
	var timer = 8;
	var Timeout = 1;
	
	$('#CountdownBar').css("width","100%");
	$('#DukeLogoBox img').attr("src",imageStatic+"Duke Spiral.jpg");
	setTimeout(function(){
		$('#DukeLogo h1').css("display","block");
	}, 5);
	if(Math.random() < 0.3) { //Adds a chance to flicker 10, a glitch found on the actual quiz
		Timeout = 150;
		console.log("Whoops timer glitch :)")
	}
	setTimeout(function(){
		$('#DukeLogo h1').text(9);
	}, Timeout);
	var x = setInterval(function() { //Timer stays on 1 for 3 seconds, another glitch from the actual quiz
		if(timer > 0){
			$('#DukeLogo h1').text(timer);
		} else {
			setTimeout(function(){
				$('#DukeLogo h1').css("display","none");
				$('#DukeLogoBox img').attr("src",imageStatic+"Duke Logo.jpg");
				$('#SlideUpBar').css("height","74vh");
				moveTextDown();
			}, 1000);
			setTimeout(function() {
				$('#TransitionBar').css("height","100vh");
				setValues(questions[9-loop]);
			}, 4000);
			setTimeout(() => reset(), 4700);
			setTimeout(function(){
				if(loop != 0) moveTextUp()
			}, 4500); 

			clearInterval(x);
		}
		timer=timer-1;
	},1000);
}

function reset(){ // Please make better, this is very diy
	$('#SlideUpBar').css("transition","0s");
	$('#SlideUpBar').css("height","0");
	$('#TransitionBar').css("transition","0s");
	$('#TransitionBar').css("height","0");
	$('#CountdownBar').css("transition","0s");
	$('#CountdownBar').css("width","0");
	
	setTimeout(function(){
		$('#SlideUpBar').removeAttr( 'style' );
		$('#CountdownBar').removeAttr( 'style' );
		$('#TransitionBar').removeAttr( 'style' );
	}, 1000);

	
}

//Main Move Functions
function moveTextUp() {
	$('#QuestionBox h1').css("display","block");
	setTimeout(function(){
		$('#QuestionBox h1').css({'transform': 'translate(0, 0%)'});
	}, 100);

	$('.OptionsBox .Option h1').css("display","block");
	$('.OptionsBox .Option p').css("display","block");
	setTimeout(function(){
		$('.OptionsBox .Option h1').css("top","50%");
		$('.OptionsBox .Option p').css("top","50%");
	}, 400);
}

function moveTextDown() {
	$('#QuestionBox h1').css("display","none");
	$('#QuestionBox h1').css({'transform': 'translate(0, 150%)'});

	$('.OptionsBox .Option h1').css("display","none");
	$('.OptionsBox .Option p').css("display","none");
	$('.OptionsBox .Option h1').css("top","150%");
	$('.OptionsBox .Option p').css("top","150%");
}

function moveLogo(Direction) {
	if(Direction == 'DOWN'){
		$('#DukeLogoBox').css("height","34.7vh");
		$('#DukeLogo').css("width","8.3%");
	} else {
		$('#DukeLogoBox').css("height","100vh");
		$('#DukeLogo').css("width","11.7%");

	}
	
}

function setValues(Question){
	$('#QuestionBox h1').text(questions[9-loop]['question']);
	$('.Option').each(function(index) {
		$(this).find('p').text(Question['options'][index]);
	});
}

// Youtube Playlist Stuff
let player;

function loadYouTubeIframeAPI() {
	const tag = document.createElement('script');
	tag.src = 'https://www.youtube.com/iframe_api';
	const firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    console.log('onYouTubeIframeAPIReady called');
    player = new YT.Player('player', {
        playerVars: {
            listType: 'playlist',
            list: 'PLSdaxYHBYxmzjZeqkO66jiuZQ4aepuoy7',
            origin: 'http://localhost:8100',
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}


function playVideo() {
  if (player && typeof player.playVideo === 'function') {
    player.playVideo();
	
	
  } else {
    console.error('Player not initialized or playVideo not available');
  }
}

function pauseVideo() {
    player.pauseVideo();
}

function onPlayerReady(event) {
	player.setVolume(0);
	player.playVideo();
	setTimeout(() => event.target.setVolume(100), 2000);
	
	fadePlayer('in');
	setTimeout(async function(){
		countdown();
		var x = setInterval(function() {
			$('#SlideUpBar h1').text(questions[9-loop]['answer']);
			loop=loop-1;
			countdown();
			if (loop == 0) {
				clearInterval(x);
				setTimeout(() => fadePlayer('out'), 14000);
				setTimeout(() => moveLogo('UP'), 14000);
			}
		},15500);
	},3300)
}

function onPlayerStateChange(event) {
      console.log('Player state changed:', event.data);
    }

function fadePlayer(Type) {
    let volume = player.getVolume();
    if(Type == 'out'){
        if (volume > 0) {
            player.setVolume(volume - 1);
            setTimeout(() => fadePlayer('out'), 20);
        } else {
            player.pauseVideo();
        }
    }
    if(Type == 'in'){
		if (volume == 0){
			player.playVideo();
			player.setVolume(1);
			setTimeout(() => fadePlayer('in'), 20);
		} else if (volume < 100) {
            player.setVolume(volume + 1);
            setTimeout(() => fadePlayer('in'), 20);
        }	
    }
}



