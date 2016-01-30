'use strict';

const RollingSpider = require('rolling-spider');
const temporal = require('temporal');

let drone = new RollingSpider();


drone.connect(function() {
  drone.setup(function() {

    // Reset the trim so the drone's flight is stable - "should always be called before taking off"
    drone.calibrate();

    // Starts sending the current speed values to the drone every 50 milliseconds
    drone.startPing();

    // TODO do we need this again?
    drone.calibrate();

    temporal.queue([
      {
        delay: 5000,
        task: function () {
          drone.takeOff();
          // TODO do we need this again?
          drone.calibrate();
        }
      },
      {
        delay: 5000,
        task: function () {
          drone.land();
        }
      },
      {
        delay: 5000,
        task: function () {
          temporal.clear();
          process.exit(0);
        }
      }
    ]);

  });
});

