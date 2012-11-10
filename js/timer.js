var runTimer;
var totalTime;
var currentTime;

function checkUserInput() {
	var user_input = $("#timer .timer-time").val().match(/^([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-9]+:[0-5][0-9]|[0-9]+)$/);
	if (user_input != null) {
		$("#timer .timer-timeleft").text(user_input[0]);
		
		var time_components = user_input[0].split(":");				
		switch (time_components.length) {
			case 1: 
				totalTime = parseInt(time_components[0]);
				break;
				
			case 2:
				totalTime = (parseInt(time_components[0]) * 60) + parseInt(time_components[1]);
				break;
				
			case 3:
				totalTime = (parseInt(time_components[0]) * 60 * 60) + (parseInt(time_components[1]) * 60) + parseInt(time_components[2]);
				break;
		}
		
		currentTime = 0;
	} else {
		// TODO: Display error message to user
	}
}

function startTimer() {
	$("#timer .timer-play").attr("disabled", "disabled");
	$("#timer .timer-stop").removeAttr("disabled");
	$("#timer .timer-reset").removeAttr("disabled");
	
	$("#timer .timer-progress").addClass("active");
	
	runTimer = true;
	
	tickTimer();
}

function stopTimer() {
	$("#timer .timer-play").removeAttr("disabled");
	$("#timer .timer-stop").attr("disabled", "disabled");
	$("#timer .timer-reset").removeAttr("disabled");
	
	$("#timer .timer-progress").removeClass("active");
	
	runTimer = false;
	
	tickTimer();
}

function resetTimer() {
	$("#timer .timer-play").removeAttr("disabled");
	$("#timer .timer-stop").attr("disabled", "disabled");
	$("#timer .timer-reset").attr("disabled", "disabled");

	$("#timer .timer-bar").width("0%");
	$("#timer .timer-progress").removeClass("active");
	
	runTimer = false;
	
	checkUserInput();
}

function tickTimer() {
	if ((runTimer == true) && (currentTime < totalTime)) {
		var timeSeconds = totalTime - currentTime;

        var timeHours = Math.floor(timeSeconds / (60 * 60));
        timeSeconds -= timeHours * (60 * 60);

        var timeMinutes = Math.floor(timeSeconds / 60);
        timeSeconds -= timeMinutes * (60);

		if (timeHours > 0) {
			$("#timer .timer-timeleft").text(timeHours + ":" + ((timeMinutes < 10) ? "0" + timeMinutes : timeMinutes) + ":" + ((timeSeconds < 10) ? "0" + timeSeconds : timeSeconds));
		} else if (timeMinutes > 0) {
			$("#timer .timer-timeleft").text(timeMinutes + ":" + ((timeSeconds < 10) ? "0" + timeSeconds : timeSeconds));
		} else {
			$("#timer .timer-timeleft").text(timeSeconds);
		}
		
		var progress = ((currentTime / totalTime) * 100).toFixed(2);
		$("#timer .timer-bar").width(progress + "%");
		
		var time = totalTime - currentTime;
		if (time <= 10) {
			$("#timer .timer-progress").removeClass("progress-success progress-warning").addClass("progress-danger");			
		} else if ((progress >= 75) || (((totalTime * 0.25) <= 20) && (time <= 20))) {
			$("#timer .timer-progress").removeClass("progress-success progress-danger").addClass("progress-warning");	
		} else {
			$("#timer .timer-progress").removeClass("progress-warning progress-danger").addClass("progress-success");
		}

		currentTime += 1;

		setTimeout(tickTimer, 1000);
	} else if (runTimer == true) {
		$("#timer .timer-play").attr("disabled", "disabled");
		$("#timer .timer-stop").attr("disabled", "disabled");
		$("#timer .timer-reset").removeAttr("disabled");

		$("#timer .timer-bar").width("100%");
		$("#timer .timer-progress").removeClass("active");

		$("#timer .timer-timeleft").text("Stop!");
		
		runTimer = false;
	}
}
