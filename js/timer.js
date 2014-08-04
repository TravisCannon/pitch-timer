/*
 * Timer JavaScript using AngularJS
 */
angular.module('TimerApp', ['ngAnimate'])

	/*
	 * Configure application
	 */
	.config(function($locationProvider) {
		$locationProvider.html5Mode(true);
    })

	/*
	 * Time Formatter factory to parse and format time
	 */
	.factory('TimeFormatter', function() {
		return {
			// Format time from seconds to HH:MM:SS
			secondsToHHMMSS: function(seconds) {
				var formatted_time = "";

				var hours = Math.floor(seconds / (60 * 60));
				seconds -= hours * (60 * 60);

				var minutes = Math.floor(seconds / 60);
				seconds -= minutes * (60);

				if (hours > 0) {
					formatted_time = hours + ":" + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
				} else if (minutes > 0) {
					formatted_time = minutes + ":" + ((seconds < 10) ? "0" + seconds : seconds);
				} else {
					formatted_time = seconds;
				}

				return formatted_time;
			},

			// Parse time from HH:MM:SS to seconds
			hhmmssToSeconds: function(time) {
				var seconds = 0;
				var components = time.split(":");

				switch (components.length) {
					case 1:
						seconds = parseInt(components[0]);
						break;

					case 2:
						seconds = (parseInt(components[0]) * 60) + parseInt(components[1]);
						break;

					case 3:
						seconds = (parseInt(components[0]) * 60 * 60) + (parseInt(components[1]) * 60) + parseInt(components[2]);
						break;
				}

				return seconds;
			}
		};
	})

	/*
	 * URL parameter parsers
	 */
	.factory('URLParser', ['TimeFormatter', function(TimeFormatter) {
		return {
			// Parse time parameter
			timeParameter: function(parameter, defaultValue) {
				var value = defaultValue;
				var time_format = /^([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-9]+:[0-5][0-9]|[0-9]+)$/;

				if (parameter != undefined) {
					if ((typeof parameter === 'string') && (parameter.match(time_format))) {
						value = TimeFormatter.hhmmssToSeconds(parameter);
					} else if ((typeof parameter === 'number') && (parameter > 0)) {
						value = parseInt(parameter);
					}
				}

				return value;
			},

			// Parse audio parameter
			audioParameter: function(parameter, defaultValue) {
				var value = defaultValue;

				if (parameter != undefined) {
					if (typeof parameter === 'boolean') {
						value = parameter;
					} else if (typeof parameter === 'string') {
						if ((parameter.toLowerCase() === 'off') || (parameter.toLowerCase() === 'false')) {
							value = false;
						} else if ((parameter.toLowerCase() === 'on') || (parameter.toLowerCase() === 'true')) {
							value = true;
						}
					} else if (typeof parameter === 'number') {
						value = (parameter > 0) ? true : false;
					}
				}

				return value;
			}
		};
	}])

	/*
	 * Time directive to enhance and validate user input
	 */
	.directive('time', ['TimeFormatter', function(TimeFormatter) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function($scope, $element, $attrs, ngModelController) {
				var time_format = /^([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-9]+:[0-5][0-9]|[0-9]+)$/;

				ngModelController.$formatters.push(function(value) {
					value = TimeFormatter.secondsToHHMMSS(value);

					var isValid = typeof value === 'string'
						&& value.match(time_format);

					ngModelController.$setValidity('time', isValid);

					return value;
				});

				ngModelController.$parsers.push(function(value) {
					var isValid = typeof value === 'string'
						&& value.match(time_format);

					ngModelController.$setValidity('time', isValid);

					return isValid ? TimeFormatter.hhmmssToSeconds(value.match(time_format)[0]) : undefined;
				});
			}
		};
	}])

	/*
	 * Timer controller
	 */
	.controller('TimerCtrl', ['$scope', '$location', '$timeout', 'URLParser', 'TimeFormatter', function($scope, $location, $timeout, URLParser, TimeFormatter) {
		// Progress bar style enum
		var ProgressBarStyle = { success: 'success', warning: 'warning', danger: 'danger' };

		// Get presets from URL
		var url_presets = $location.search();
		var url_command = $location.hash();

		// Timer models
		$scope.is_running = false;
		$scope.show_settings = false;
		$scope.progress_bar_style = ProgressBarStyle.success;
		$scope.time_count = 0;
		$scope.time_progress = 0;
		$scope.time_total = URLParser.timeParameter(url_presets['time'], 60);
		$scope.time_warning = URLParser.timeParameter(url_presets['warning'], 20);
		$scope.time_danger = URLParser.timeParameter(url_presets['danger'], 10);
		$scope.time_left = TimeFormatter.secondsToHHMMSS($scope.time_total);

		// Audio cues
		$scope.play_audio = URLParser.audioParameter(url_presets['audio'], false);

		$scope.beep_danger = document.createElement('audio');
		$scope.beep_danger.src = 'media/beep-danger.mp3';

		$scope.beep_warning = document.createElement('audio');
		$scope.beep_warning.src = 'media/beep-warning.mp3';

		$scope.beep_end = document.createElement('audio');
		$scope.beep_end.src = 'media/beep-end.mp3';

		// Update time
		$scope.updateTime = function () {
			$scope.time_count = 0;
			$scope.time_progress = 0;
			$scope.progress_bar_style = ProgressBarStyle.success;
			$scope.time_left = TimeFormatter.secondsToHHMMSS($scope.time_total);
		};

		// Start timer
		$scope.startTimer = function () {
			$scope.is_running = true;
			tickTimer();
		};

		// Stop timer
		$scope.stopTimer = function () {
			$scope.is_running = false;
			tickTimer();
		};

		// Reset timer
		$scope.resetTimer = function () {
			$scope.is_running = false;
			$scope.updateTime();
		};

		// Toggle settings
		$scope.toggleSettings = function () {
			$scope.show_settings = !($scope.show_settings);
		};

		// Tick timer
		var tickTimer = function () {
			if (($scope.is_running == true) && ($scope.time_count < $scope.time_total)) {
				var time_remaining = $scope.time_total - $scope.time_count;

				$scope.time_left = TimeFormatter.secondsToHHMMSS(time_remaining);
				$scope.time_progress = (($scope.time_count / $scope.time_total) * 100).toFixed(2);

				if (time_remaining <= $scope.time_danger) {
					if (($scope.play_audio == true) && ($scope.progress_bar_style != ProgressBarStyle.danger)) {
						$scope.beep_danger.play();
					}

					$scope.progress_bar_style = ProgressBarStyle.danger;
				} else if (time_remaining <= $scope.time_warning) {
					if (($scope.play_audio == true) && ($scope.progress_bar_style != ProgressBarStyle.warning)) {
						$scope.beep_warning.play();
					}

					$scope.progress_bar_style = ProgressBarStyle.warning;
				} else {
					$scope.progress_bar_style = ProgressBarStyle.success;
				}

				$scope.time_count += 1;

				$timeout(tickTimer, 1000);
			} else if ($scope.is_running == true) {
				$scope.is_running = false;
				$scope.time_count = 0;
				$scope.time_progress = 100;
				$scope.time_left = 'Stop!';

				if ($scope.play_audio == true) {
					$scope.beep_end.play();
				}
			}
		};

		// Execute URL command
		if (url_command.toLowerCase() === 'start') {
			$scope.startTimer();
		}
	}])
;
