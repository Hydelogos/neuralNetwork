class Neuron{
  constructor(weights){
    this.in = 1;
    this.out = 1;
    this.weights = [];
    for(var i = 0; i < weights; i++){
      var test = Math.random()/10 ;
      if(test == 0){
        test+=0.1;
      }
      this.weights.push(test);
    }
  }
}

class Network{
  constructor(input, hidden, output){
    this.bias = [];
    this.inputs = [];
    this.hiddens = [];
    this.outputs = [];
    this.target = [];
    this.classes = [];
    this.bias.push(new Neuron(hidden));
    this.bias.push(new Neuron(output));
    this.learningRate = 0.1;
    this.error = 0;
    for(var i = 0; i < input; i++){
      this.inputs.push(new Neuron(hidden));
    }
    for(var i = 0; i < hidden; i++){
      this.hiddens.push(new Neuron(output));
    }
    for(var i = 0; i < output; i++){
      this.outputs.push(new Neuron(0));
    }
  }


  learn(input, expected, turns){

      this.target = expected;
      for(var i = 0; i < this.inputs.length; i++){
        this.inputs[i].out = (1-0) * (input[i]-Math.min(input)) / (Math.max(input)-Math.min(input)) + 0;
      }
      for(var i = 0; i < turns; i++){
        this.hiddenCalculation();
        this.outputCalculation();
        this.backPropagate();
      }
      this.logResult();
  }

  setClasses(classes){
    this.classes = classes;
  }

  train(data){
    var random = 0;
    var max = data.length - 1;
    var wrong = true;
    var check = 0;
    var turns = 0;
    console.log(data[1][0]);

    for(var i = 0; i < 10000; i++){

      while(wrong){
        check = 0;
        turns += 1;
        for(var i = 0; i < 100000; i++){
          random = (Math.floor(Math.random() * (max - 0 + 1)) + 0);
          this.checkForNan();
          this.setInputAndResult(data[random][0], data[random][1]);
          this.hiddenCalculation();
          this.outputCalculation();
          this.backPropagate();
        }
        for(var i = 0; i < data.length; i++){
          var verif = true;
          this.setInputAndResult(data[i][0], data[i][1]);
          this.hiddenCalculation();
          this.outputCalculation();
          for(var y = 0; y < this.outputs.length; y++){
            if( this.outputs[y].out - (data[i][1][y]/35) > 0.005  || this.outputs[y].out - (data[i][1][y]/35) < -0.005){
              verif = false;
            }
          }
          if( verif ){
            check += 1;
        }
        if(check == data.length){
          wrong = false;
        }
        if(turns > 150 && wrong){
          this.reset();
          turns = 0;
        }
        wrong = false;
      }
    }
  }
}


  trainClass(data){
    var random = 0;
    var max = data.length - 1;
    var wrong = true;
    var check = 0;
    var turns = 0;
    var waiting = [];

    for(var i = 0; i < data.length; i++){
      var startingPoint = []
      for(var a = 0; a < this.outputs.length; a++){
        startingPoint.push(0);
      }
      startingPoint[this.classes.indexOf(data[i][1])] = 1;
      waiting.push(startingPoint);
    }
    while(wrong){
      check = 0;
      turns += 1;
      for(var i = 0; i < 100000; i++){
        random = (Math.floor(Math.random() * (max - 0 + 1)) + 0);
        this.checkForNan();
        this.setInputAndResult(data[random][0], waiting[random]);
        this.hiddenClassCalculation();
        this.outputClassCalculation();
        this.backPropagateClass();
      }
      for(var i = 0; i < data.length; i++){
        this.setInputAndResult(data[i][0], waiting[i]);
        this.hiddenClassCalculation();
        this.outputClassCalculation();
        if(this.outputs[waiting[i].indexOf(1)].out > 0.5){
          check += 1;

        }
      }
      if(check == data.length){
        wrong = false;
      }
      if(turns > 10 && wrong){
        this.reset();
        turns = 0;
      }
    }
  }

  reset(){
    var test = 0;
    for(var i = 0; i < this.inputs.length; i++){


      for(var j = 0; j < this.hiddens.length; j++){
        test = (Math.floor(Math.random() * (5 - (-5) + 1)) -5);
        if(test == 0){
          test+=1;
        }
        this.inputs[i].weights[j] = test;
        test = (Math.floor(Math.random() * (5 - (-5) + 1)) -5);
        if(test == 0){
          test+=1;
        }
        this.bias[0].weights[j] = test;
        for(var k = 0; k < this.outputs.length; k++){
          test = (Math.floor(Math.random() * (5 - (-5) + 1)) -5);
          if(test == 0){
            test+=1;
          }
          this.hiddens[j].weights[k] = test;
          test = (Math.floor(Math.random() * (5 - (-5) + 1)) -5);
          if(test == 0){
            test+=1;
          }
          this.bias[1].weights[k] = test;
        }
      }
    }
}

  checkForNan(){
    /*for(var i = 0; i < this.inputs.length; i++){

      if(isNaN(this.inputs[i].out)){
        console.log("input " + i + " est NaN");
        throw new Error("");
      }
      this.inputs[i].out = parseFloat(this.inputs[i].out).toFixed(19);
      for(var j = 0; j < this.hiddens.length; j++){
        if(isNaN(this.inputs[i].weights[j])){
          console.log("poids " + j + " de input " + i +" est NaN");
          throw new Error("");
        }
        this.inputs[i].weights[j] = parseFloat(this.inputs[i].weights[j]).toFixed(19);
        if(isNaN(this.hiddens[j].out)){
          console.log("hidden " + j + " est NaN");
          throw new Error("");
        }
        this.bias[0].weights[j] = parseFloat(this.bias[0].weights[j]).toFixed(19);
        this.hiddens[j].out = parseFloat(this.hiddens[j].out).toFixed(19);
        for(var k = 0; k < this.outputs.length; k++){
          if(isNaN(this.hiddens[j].weights[k])){
            console.log("poids " + k + " de hidden " + j +" est NaN");
            throw new Error("");
          }
          this.hiddens[j].weights[k] = parseFloat(this.hiddens[j].weights[k]).toFixed(19);
          if(isNaN(this.outputs[k].out)){
            console.log("output " + k + " est NaN");
            throw new Error("");
          }
          this.bias[1].weights[k] = parseFloat(this.bias[1].weights[k]).toFixed(19);
          this.outputs[k].out = parseFloat(this.outputs[k].out).toFixed(19);
          console.log(parseFloat(this.outputs[k].out).toFixed(19));
        }
      }
    }*/
  }

  setInputAndResult(input, expected){
    var max = 300;
    var min = 0;
    var normalized = []
    for(var i = 0; i < expected.length; i++){
      console.log(expected[i]);
      normalized[i] = (1-0) * (expected[i]-min) / (35-min) + 0;
    }
    this.target = normalized;
    for(var i = 0; i < this.inputs.length; i++){
      this.inputs[i].in = (1-0) * (input[i]-min) / (max-min) + 0;
      this.inputs[i].out = (1-0) * (input[i]-min) / (max-min) + 0;
    }
  }

  learnClass(input, expected, turns){
      this.target = expected;
      for(var i = 0; i < this.inputs.length; i++){
        this.inputs[i].in = input[i];
        this.inputs[i].out = input[i];
      }



      for(var i = 0; i < turns; i++){
        this.hiddenClassCalculation();
        this.outputClassCalculation();
        this.backPropagateClass();
      }
      this.logResult();
  }

  test(input){
    var max = 300;
    var min = 0;
    for(var i = 0; i < this.inputs.length; i++){
      this.inputs[i].out = (1-0) * (input[i]-min) / (max-min) + 0;
        this.inputs[i].in = (1-0) * (input[i]-min) / (max-min) + 0;
    }
    this.hiddenCalculation();
    this.outputCalculation();
    var result = this.getResult();
    return result;
  }

  testClass(input){
    for(var i = 0; i < this.inputs.length; i++){
        console.log(input[i]);
      this.inputs[i].in = input[i];
      this.inputs[i].out = input[i];
    }
    this.hiddenClassCalculation();
    this.outputClassCalculation();
    this.logResult();
  }

  hiddenClassCalculation(){
    for(var i = 0; i < this.hiddens.length; i ++){
      var inData = 0;
      for(var y = 0; y < this.inputs.length; y++){
        inData += this.inputs[y].weights[i] * this.inputs[y].out;
      }
      inData += -this.bias[0].in * this.bias[0].weights[i];
      this.hiddens[i].in = inData;
      if(inData < 0){
        inData *= 0.01;
      }
      this.hiddens[i].out = 1 / (1 - Math.exp(inData));
    }
  }

  hiddenCalculation(){
    for(var i = 0; i < this.hiddens.length; i ++){
      var inData = 0;
      for(var y = 0; y < this.inputs.length; y++){
        inData += this.inputs[y].weights[i] * this.inputs[y].out;
      }
      inData += this.bias[0].in * this.bias[0].weights[i];
      this.hiddens[i].in = inData;
      /*if(inData < 0){
        inData *= 0.01;
      }
      this.hiddens[i].out = inData;*/
      this.hiddens[i].out = (1/ (1 + Math.exp(-this.hiddens[i].in)))
    }
  }

  outputClassCalculation(){
    var sumExp = 0;
    var max = 0;
    for(var i = 0; i < this.outputs.length; i ++){
      var inData = 0;
      for(var y = 0; y < this.hiddens.length; y++){
        inData += this.hiddens[y].weights[i] * this.hiddens[y].out;
      }
      if(inData > max){
        max = inData;
      }
    }
    for(var i = 0; i < this.outputs.length; i ++){
      var inData = 0;
      for(var y = 0; y < this.hiddens.length; y++){
        inData += this.hiddens[y].weights[i] * this.hiddens[y].out;
      }
      inData += -this.bias[1].in * this.bias[1].weights[i];
      this.outputs[i].in = inData - max;
      sumExp += Math.exp(inData - max);
    }
    for(var i = 0; i < this.outputs.length; i ++){
      this.outputs[i].out = Math.exp(this.outputs[i].in) / sumExp;
    }

  }

  outputCalculation(){
    for(var i = 0; i < this.outputs.length; i ++){
      var inData = 0;
      for(var y = 0; y < this.hiddens.length; y++){
        inData += this.hiddens[y].weights[i] * this.hiddens[y].out;
      }
      this.outputs[i].in = inData;
      this.outputs[i].out = (1/ (1 + Math.exp(-this.outputs[i].in)));
    }
  }

  errorCalculation(){
    this.error = 0;
    for(var i = 0; i < this.outputs.length; i ++){
      this.error += ((Math.pow(this.target[i] - this.outputs[i].out), 2)/2);
    }
  }

  backPropagate(){
    this.hiddenToInput();
    this.outputToHidden();
  }

  backPropagateClass(){
    this.hiddenToInputClass();
    this.outputToHiddenClass();
  }

  hiddenToInput(){
    for(var i = 0; i < this.inputs.length; i++){
      var tiers1 = 0;
      var tiers2 = 0;
      var tiers3 = 0;
      var tiersBias = 0;
      var final = 0;
      var finalBias = 0;
      for(var j = 0; j < this.hiddens.length; j++){
        tiers1 = 0;
        for(var k = 0; k < this.outputs.length; k++){
          tiers1 += ((0.5 * Math.pow(this.target[k] - this.outputs[k].out, 2)) * (this.outputs[k].out * (1 - this.outputs[k].out))) * this.hiddens[j].weights[k];
        }
        tiers2 = this.hiddens[j].out * (1 - this.hiddens[j].out);
        tiers3 = this.inputs[i].out;
        tiersBias = this.bias[0].out;
        final = tiers1 * tiers2 * tiers3;
        finalBias = tiers1 * tiers2 * tiersBias;
        this.inputs[i].weights[j] = this.inputs[i].weights[j] - (this.learningRate * final);
        this.bias[0].weights[j] = this.bias[0].weights[j] - (this.learningRate * finalBias);
      }
    }
  }

  outputToHidden(){
    for(var i = 0; i < this.hiddens.length; i++){
      var tiers1 = 0;
      var tiers2 = 0;
      var tiers3 = 0;
      var tiersBias = 0;
      var final = 0;
      var finalBias = 0;
      for(var j = 0; j < this.outputs.length; j++){
        tiers1 = this.outputs[j].out - this.target[j];
        tiers2 = this.outputs[j].out * (1 - this.outputs[j].out);
        tiers3 = this.hiddens[i].out;
        tiersBias = this.bias[1].out;
        final = tiers1 * tiers2 * tiers3;
        finalBias = tiers1 * tiers2 * tiersBias;
        this.hiddens[i].weights[j] = this.hiddens[i].weights[j] - (this.learningRate * final);
        this.bias[1].weights[j] = this.bias[1].weights[j] - (this.learningRate * finalBias);
      }
    }
  }

  hiddenToInputClass(){
    /*var sumExp = 0;
    for(var k = 0; k < this.outputs.length; k++){
      sumExp += Math.exp(this.outputs[k].in);
    }
    for(var i = 0; i < this.inputs.length; i++){
      var tiers1 = 0;
      var tiers2 = 0;
      var tiers3 = 0;
      var final = 0;
      for(var j = 0; j < this.hiddens.length; j++){
        tiers1 = 0;
        for(var k = 0; k < this.outputs.length; k++){
          tiers1 += -1*((this.target[k] * (1/this.outputs[k].out)) + (1 - this.target[k]) * (1/(1 - this.outputs[k].out))) * (Math.exp(this.outputs[k].in) * (sumExp - Math.exp(this.outputs[k].in ) ) / Math.pow(sumExp, 2)) * this.hiddens[j].weights[k];
        }
        tiers2 = this.hiddens[j].out * (1 - this.hiddens[j].out);
        tiers3 = this.inputs[i].out;
        final = tiers1 * tiers2 * tiers3;
        this.inputs[i].weights[j] = this.inputs[i].weights[j] - (this.learningRate * final);
        this.inputs[i].weights[j]
      }
    }*/
    for(var i = 0; i < this.inputs.length; i++){
      for(var j = 0; j < this.hiddens.length; j++){
        var final = 0;
        for(var k = 0; k < this.outputs.length; k++){
          final += (this.outputs[k].out - this.target[k]) * (this.hiddens[j].weights[k]) * (this.hiddens[j].out * (1 - this.hiddens[j].out));
        }
        this.inputs[i].weights[j] = this.inputs[i].weights[j] - (this.learningRate * final);
      }
    }
    for(var j = 0; j < this.hiddens.length; j++){
      var final = 0;
      for(var k = 0; k < this.outputs.length; k++){
        final += (this.outputs[k].out - this.target[k]) * (this.hiddens[j].weights[k]) * (this.hiddens[j].out * (1 - this.hiddens[j].out));
      }
      this.bias[0].weights[j] = this.bias[0].weights[j] - (this.learningRate * final);
    }
  }

  outputToHiddenClass(){
    /*var sumExp = 0;
    for(var k = 0; k < this.outputs.length; k++){
      sumExp += Math.exp(this.outputs[k].in);
    }
    for(var i = 0; i < this.hiddens.length; i++){
      var tiers1 = 0;
      var tiers2 = 0;
      var tiers3 = 0;
      var final = 0;
      for(var j = 0; j < this.outputs.length; j++){

        tiers1 = (-this.target[j]/this.outputs[j].out);

        tiers2 = Math.exp(this.outputs[j].in) * (sumExp - Math.exp(this.outputs[j].in)) / Math.pow(sumExp, 2);
        tiers3 = this.hiddens[i].out;
        final = tiers1 * tiers2 * tiers3;
        this.hiddens[i].weights[j] = this.hiddens[i].weights[j] - (this.learningRate * final);
      }
    }*/
    var final = 0;
    var final2 = 0;
    for(var i = 0; i < this.hiddens.length; i++){
      for(var j = 0; j < this.outputs.length; j++){
        final = (this.outputs[j].out - this.target[j]) * this.hiddens[i].out;
        this.hiddens[i].weights[j] = this.hiddens[i].weights[j] - (this.learningRate * final);
      }
    }
    for(var j = 0; j < this.outputs.length; j++){
      final2 = (this.outputs[j].out - this.target[j]);
      this.bias[1].weights[j] = this.bias[1].weights[j] - (this.learningRate * final2);
    }
  }

  getResult(){
    var result = [];
    for(var i = 0; i < this.outputs.length; i++){
      result.push(this.outputs[i].out * 35);
    }
    return result;
  }

  logResult(){
    for(var i = 0; i < this.outputs.length; i++){
      if(this.outputs[i].out > 0.5){
        console.log("Je pense qu'il s'agit d'un " + this.classes[i]);
      }
    }
  }


}
