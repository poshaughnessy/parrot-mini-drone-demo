'use strict';

const RollingSpider = require('rolling-spider');
const temporal = require('temporal');

let drone = new RollingSpider({logger: console.log});

console.log('Connect...');
drone.connect(function() {

  console.log('Setup...');
  drone.setup(function() {

    // Reset the trim so the drone's flight is stable - "should always be called before taking off"
    drone.calibrate();

    // Starts sending the current speed values to the drone every 50 milliseconds
    drone.startPing();

    drone.calibrate();

    temporal.queue([
      {
        delay: 5000,
        task: function () {
          console.log('Take off...');
          drone.takeOff();
          drone.calibrate();
        }
      },
      {
        delay: 5000,
        task: function () {
          console.log('Land...');
          drone.land();
        }
      },
      {
        delay: 5000,
        task: function () {
          console.log('Goodbye.');
          temporal.clear();
          process.exit(0);
        }
      }
    ]);

  });
});

