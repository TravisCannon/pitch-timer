/*
 * Timer JavaScript using AngularJS
 */
angular.module('TimerApp', ['ngAnimate'])

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
    .controller('TimerCtrl', ['$scope', '$timeout', 'TimeFormatter', function($scope, $timeout, TimeFormatter) {
        // Progress bar style enum
        var ProgressBarStyle = { success: 'success', warning: 'warning', danger: 'danger' };

        // Timer models
        $scope.is_running = false;
        $scope.show_settings = false;
        $scope.progress_bar_style = ProgressBarStyle.success;
        $scope.time_count = 0;
        $scope.time_progress = 0;
        $scope.time_total = 60;
        $scope.time_warning = 20;
        $scope.time_danger = 10;
        $scope.time_left = TimeFormatter.secondsToHHMMSS($scope.time_total);

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
                    $scope.progress_bar_style = ProgressBarStyle.danger;
                } else if (time_remaining <= $scope.time_warning) {
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
            }
        }
    }])
;
