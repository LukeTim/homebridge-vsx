var Service, Characteristic, VolumeCharacteristic, InputCharacteristic;
var net = require('net');

var VOL_MAX = 141; //don't set volume higher than -10.0dB

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  buildCharacteristics();
  
  homebridge.registerAccessory("homebridge-vsx", "VSX", VSX);
}

function VSX(log, config) {
  this.log = log;
  this.name = config.name;
  this.HOST = config.ip;
  this.PORT = 23;

  this.service = new Service.Switch(this.name);
  
  this.service.getCharacteristic(Characteristic.On)
    .on("set", this.setOn.bind(this))
    .on("get", this.getOn.bind(this));
  
  this.service.getCharacteristic(VolumeCharacteristic)
    .on("set", this.setVolume.bind(this))
    .on("get", this.getVolume.bind(this));
  
  this.service.getCharacteristic(InputCharacteristic)
    .on("set", this.setInput.bind(this))
    .on("get", this.getInput.bind(this));
}

VSX.prototype.getServices = function() {
  return [this.service];
}

VSX.prototype.getOn = function(callback) {
  
  var client = new net.Socket();
  client.connect(this.PORT, this.HOST, function() {
   
    console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    client.write('?P\r\n');

  }); 
    
    client.on('data', function(data) {
    
      console.log('DATA: ' + data);
      var str = data.toString();
      
      if (str.includes("PWR1")) {
        console.log("AUS");
        var on = false;
        client.destroy();
        callback(null,on);
        
      } else if (str.includes("PWR0")) {
        console.log("AN");
        var on = true;
        client.destroy();
        callback(null,on);
        
      } else {
        console.log("waiting");
      }

  });
  
    client.on('close', function() {
    console.log('Connection closed');
    
  });

    client.on('error', function(ex) {
      console.log("handled error");
      console.log(ex);
      callback(ex)
    
  }); 
}



VSX.prototype.setOn = function(on, callback) {

  if(on){
    var client = new net.Socket();
    client.connect(this.PORT, this.HOST, function() {

    console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('PO\r\n');
    
    client.destroy();
  
});
     //Add a 'close' event handler for the client sock
    client.on('close', function() {
    console.log('Connection closed');

});

    client.on('close', function() {
    console.log('Connection closed');
    
});
 
    client.on('error', function(ex) {
    console.log("handled error");
    console.log(ex);
    
}); 

  } else {
    var client = new net.Socket();
    client.connect(this.PORT, this.HOST, function() {

    console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('PF\r\n');
    
    client.destroy();
    
    });
    
    //Add a 'close' event handler for the client sock
    client.on('close', function() {
    console.log('Connection closed');
    
    });
    
    client.on('error', function(ex) {
    console.log("handled error");
    console.log(ex);
    
    }); 
    
  }
  callback();
}

VSX.prototype.getVolume = function(callback) {
  var client = new net.Socket();
  client.connect(this.PORT, this.HOST, function() {
   
    console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    client.write('?V\r');

  }); 
    
    client.on('data', function(data) {
    
      console.log('DATA: ' + data);
      var str = data.toString();
      
      if (str.includes("VOL")) {
        var vol = parseInt(str.trim().replace("VOL", ""));
        console.log("Volume: " + vol);
        var vol_percent = parseInt((parseFloat(vol)/185.0) * 100);
        console.log("Volume Percentage: " + vol_percent);
        client.destroy();
        callback(null, vol_percent);
        
      } else {
         console.log("waiting");
      }

  });
  
    client.on('close', function() {
    console.log('Connection closed');
    
  });

    client.on('error', function(ex) {
      console.log("handled error");
      console.log(ex);
      callback(ex)
    
  }); 
}

VSX.prototype.setVolume = function(volume, callback) {
  var client = new net.Socket();
  
  var vol = (parseFloat(volume)/100) * VOL_MAX; //convert from percentage to integer between 0 and VOL_MAX
  var vol_str = ("00" + vol).slice(-3); //format with leading 0s
  
  client.connect(this.PORT, this.HOST, function() {
   
    console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    client.write(vol_str + 'VL\r');

  }); 
    
    client.on('data', function(data) {
    
      console.log('DATA: ' + data);
      var str = data.toString();
      
      if (str.includes("VOL")) {
        var vol = parseInt(str.trim().replace("VOL", ""));
        console.log("Volume set to: " + vol);
        var vol_percent = parseInt((parseFloat(vol)/185.0) * 100);
        console.log("Volume Percentage set to: " + vol_percent);
        client.destroy();
        callback();
        
      } else {
         console.log("waiting");
      }

  });
  
    client.on('close', function() {
    console.log('Connection closed');
    
  });

    client.on('error', function(ex) {
      console.log("handled error");
      console.log(ex);
      callback(ex)
    
  }); 
}

VSX.prototype.getInput = function(callback) {
  var client = new net.Socket();
  client.connect(this.PORT, this.HOST, function() {
   
    console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    client.write('?F\r');

  }); 
    
    client.on('data', function(data) {
    
      console.log('DATA: ' + data);
      var str = data.toString();
      
      if (str.includes("FN")) {
        var input = parseInt(str.trim().replace("FN", ""));
        console.log("Input: " + input);
        client.destroy();
        callback(null, input);
        
      } else {
         console.log("waiting");
      }

  });
  
    client.on('close', function() {
    console.log('Connection closed');
    
  });

    client.on('error', function(ex) {
      console.log("handled error");
      console.log(ex);
      callback(ex)
    
  }); 
}

VSX.prototype.setInput = function(input, callback) {
   var client = new net.Socket();
  
  var input_str = ("0"+input).slice(-2); //format to 2 characters with leading 0s
  
  client.connect(this.PORT, this.HOST, function() {
   
    console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    client.write(input_str+'FN\r');

  }); 
    
    client.on('data', function(data) {
    
      console.log('DATA: ' + data);
      var str = data.toString();
      
      if (str.includes("FN")) {
        var input = parseInt(str.trim().replace("FN", ""));
        console.log("Input set to: " + input);
        client.destroy();
        callback();
        
      } else {
         console.log("waiting");
      }

  });
  
    client.on('close', function() {
    console.log('Connection closed');
    
  });

    client.on('error', function(ex) {
      console.log("handled error");
      console.log(ex);
      callback(ex)
    
  }); 
}

function buildCharacteristics()
{
   VolumeCharacteristic = createCharacteristic('Volume',
                                                {
                                                  format: Characteristic.Formats.INT,
                                                  unit: Characteristic.Units.PERCENTAGE,
                                                  maxValue: 100,
                                                  minValue: 0,
                                                  minStep: 1,
                                                  perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
                                                },
                                                '91288267-5678-49B2-8D22-F57BE995AA93'
                                              );
  
  inherits(VolumeCharacteristic, Characteristic);
  
  InputCharacteristic = createCharacteristic('Input',
                                                {
                                                  format: Characteristic.Formats.INT,
                                                  unit: Characteristic.Units.NONE,
                                                  maxValue: 100,
                                                  minValue: 0,
                                                  minStep: 1,
                                                  perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
                                                },
                                                '91288267-5678-49B2-8D22-F57BE995AA93'
                                             );
  
  inherits(InputCharacteristic, Characteristic); 
}

function createCharacteristic(name, params, uuid)
{
  return function() {
    Characteristic.call(this, name, uuid);
    this.setProps(params);
    this.value = this.getDefaultValue();
  };
}
