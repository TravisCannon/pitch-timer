var runTimer;
var totalTime;
var currentTime;
var warningTime;
var dangerTime;

function expandTimerSettings() {
	if ($("#timer .timer-expand button i").hasClass("icon-chevron-down")) {
		$("#timer .timer-expand button i").removeClass("icon-chevron-down").addClass("icon-chevron-up");
		$("#timer .timer-settings").show("slow");
	} else {
		$("#timer .timer-expand button i").removeClass("icon-chevron-up").addClass("icon-chevron-down");
		$("#timer .timer-settings").hide("slow");
	}
}

function validateUserInput(raw_input) {
	var user_input = raw_input.match(/^([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-9]+:[0-5][0-9]|[0-9]+)$/);
	var formatted = "0";
	var seconds = 0;
	
	if (user_input != null) {
		formatted = user_input[0];
		
		var time_components = user_input[0].split(":");				
		switch (time_components.length) {
			case 1: 
				seconds = parseInt(time_components[0]);
				break;
				
			case 2:
				seconds = (parseInt(time_components[0]) * 60) + parseInt(time_components[1]);
				break;
				
			case 3:
				seconds = (parseInt(time_components[0]) * 60 * 60) + (parseInt(time_components[1]) * 60) + parseInt(time_components[2]);
				break;
		}
	} else {
		// TODO: Display error message to user
	}
	
	return [formatted, seconds];
}

function updateTime() {
	var validated_input = validateUserInput($("#timer .timer-time").val());
	
	$("#timer .timer-timeleft").text(validated_input[0]);
	
	currentTime = 0;
	totalTime = validated_input[1];
}

function updateWarning() {
	warningTime = validateUserInput($("#inputWarning").val())[1];
}

function updateDanger() {
	dangerTime = validateUserInput($("#inputDanger").val())[1];
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
	
	updateTime();
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
		if (time <= dangerTime) {
			$("#timer .timer-progress").removeClass("progress-success progress-warning").addClass("progress-danger");			
		} else if (time <= warningTime) {
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
