Pitch Timer
===========

A simple timer to display the amount of time left during a presentation - handy for those pitches.

Settings
--------

You can configure the timer settings via the URL with the following parameters:

http://www.pitchtimer.com/?time={time}&warning={time}&danger={time}&audio={boolean}#{command}

| Parameter | Type    | Description                    | Example Values                                       |
|-----------|---------|--------------------------------|------------------------------------------------------|
| time      | time    | Sets the run time              | 60, 90, 1:30, 15:00, 90:00, 1:30:00                  |
| warning   | time    | Sets the warning time          | 30 (Note: must be less than the run time)            |
| danger    | time    | Sets the danger time           | 15 (Note: must be less than the warning time)        |
| audio     | boolean | Turns audio cues on/off        | Cues on: on, true, or 1; Cues off: off, false, or 0  |
| command   | string  | Executes the specified command | Command: start - auto starts the timer after loading |

For example, the following will set the timer to one minute and thirty seconds with a 30 second warning time and 15 second danger time, turn audio cues on, and auto start the timer after the timer loads.

[http://www.pitchtimer.com/?time=1:30&warning=30&danger=15&audio=true#start](http://www.pitchtimer.com/?time=1:30&warning=30&danger=15&audio=true#start)

Author
------

Travis Cannon, travis@traviscannon.com, [www.traviscannon.com](http://www.traviscannon.com/)

License
-------

Pitch Timer is licensed under a [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_US).
