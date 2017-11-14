class imageProcessor{
  constructor(){
    this.data = [];
    this.count = 0;
    this.path = [];
    this.currentPath = 0;
    this.networkX = new Network(36, 40, 1);
    this.networkY = new Network(36, 40, 1);
    this.networkX2 = new Network(36, 40, 1);
    this.networkY2 = new Network(36, 40, 1);
  }

  analyze(path){
    this.path = path;
    this.loadPicture(this.path[this.currentPath]);
  }

  next(){
    if(this.currentPath >= this.path.length - 1){
      this.currentPath = -1;
    }
    this.currentPath ++;
    this.loadPicture(this.path[this.currentPath]);
  }

  neuralTrain(){
    var theDataX = [];
    var theDataY = [];
    var theDataX2 = [];
    var theDataY2 = [];
    var temporary = [];
    for(var i = 0; i < this.data.length; i++){
      for(var y = 0; y < this.data[i][0].length; y++){
        for(var x = 0; x < this.data[i][0][y].length; x++){
          temporary.push(this.data[i][0][y][x]);
        }
      }
      theDataX.push([temporary, [this.data[i][1][0][0]]]);
      theDataY.push([temporary, [this.data[i][1][0][1]]]);
      theDataX2.push([temporary, [this.data[i][1][1][0]]]);
      theDataY2.push([temporary, [this.data[i][1][1][1]]]);
      console.log(this.data[i][1][1][1]);
      console.log(this.data[i][1][1][0]);
      temporary = [];
    }
    this.networkX.train(theDataX);
    this.networkY.train(theDataY);
    this.networkX2.train(theDataX2);
    this.networkY2.train(theDataY2);
  }

  neuralTest(path){
    var image = new Image();
    image.crossOrigin = '';

    image.src = path;
    var maClass = this;
    image.onload = function() {
      var canvas = document.getElementById("image");
      canvas.width = image.width;
      canvas.height = image.height;
      this.count = 0;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var gray = maClass.pixelExtraction(imageData);
      var testSampleTotal = maClass.mapExtraction(gray, 0, false);
      var trueResult = [];
      var testSample = testSampleTotal[0];
      var testSample2 = testSampleTotal[1];
      var testSample3 = testSampleTotal[2];
      for(var y = 0; y < testSample.length; y++){
        for(var x = 0; x < testSample[y].length; x++){
          trueResult.push(testSample[y][x]);
        }
      }
      var resultX = maClass.networkX.test(trueResult);
      var resultY = maClass.networkY.test(trueResult);
      var resultX2 = maClass.networkX2.test(trueResult);
      var resultY2 = maClass.networkY2.test(trueResult);
      trueResult = [];
      for(var y = 0; y < testSample2.length; y++){
        for(var x = 0; x < testSample2[y].length; x++){
          trueResult.push(testSample2[y][x]);
        }
      }
      resultX[0] += maClass.networkX.test(trueResult)[0];
      resultY[0] += maClass.networkY.test(trueResult)[0];
      resultX2[0] += maClass.networkX2.test(trueResult)[0];
      resultY2[0] += maClass.networkY2.test(trueResult)[0];
      trueResult = [];
      for(var y = 0; y < testSample3.length; y++){
        for(var x = 0; x < testSample3[y].length; x++){
          trueResult.push(testSample3[y][x]);
        }
      }
      resultX[0] += maClass.networkX.test(trueResult)[0];
      resultY[0] += maClass.networkY.test(trueResult)[0];
      resultX2[0] += maClass.networkX2.test(trueResult)[0];
      resultY2[0] += maClass.networkY2.test(trueResult)[0];
      resultX[0] /= 3;
      resultY[0] /= 3;
      resultX2[0] /= 3;
      resultY2[0] /= 3;

      console.log(resultX[0] + " " + resultY[0] + " " + resultX2[0] + " " + resultY2[0]);
      context.beginPath();
      context.lineWidth="4";
      context.strokeStyle="green";
      context.rect(resultX[0], resultY[0], resultX2[0] - resultX[0], resultY2[0] - resultY[0]);
      context.stroke();
    }
  }

  loadPicture(path){
    console.log(this.count);
    var image = new Image();
    image.crossOrigin = '';
    image.src = path;
    var maClass = this;
    image.onload = function() {
      var canvas = document.getElementById("image");
      canvas.width = image.width;
      canvas.height = image.height;
      maClass.count = 0;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var expect = [];
       var listener = function(event){
        console.log("test");
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        console.log("x: " + x + " y: " + y);
        maClass.count ++;
        expect.push([x, y]);
        if(maClass.count >=2){
          canvas.removeEventListener("click", listener, false);
          maClass.count = 0;
          var gray = maClass.pixelExtraction(imageData);
          maClass.mapExtraction(gray, expect, true);
          console.log("Extracted!");
          console.log(maClass.count);
          expect = [];
          maClass.next();
        }

      }
    canvas.addEventListener("click", listener, false);


    }
  }

  pixelExtraction(imageData){
    var x, y;

    var index = 0;
    var red = 0;
    var green = 0;
    var blue = 0;

    var grayImage = [];

    for(y = 0; y <= imageData.height; y ++){
      grayImage.push([]);
      for(x = 0; x <= imageData.width; x++){
        index = (y * imageData.width + x) * 4;
        red = imageData.data[index];
        green = imageData.data[index + 1];
        blue = imageData.data[index + 2];
        grayImage[y].push(this.grayScale(red, green, blue));
      }
    }
    console.log(grayImage);
    return grayImage;
  }

  mapExtraction(imageData, expect, test){
    var maps = this.convolution(imageData);
    /*if(test){
      for(var i = 0; i < 2; i++){
        expect[0][0] +=1;
        expect[0][1] += 1;
        expect[1][0] -= 1;
        expect[1][1] -= 1;
        var division = Math.floor((expect[1][0] - expect[0][0])/4);

        expect[0][0] += division;
        expect[1][0] -= division;

        division = Math.floor((expect[1][1] - expect[0][1])/4);

        expect[0][1] += division;
        expect[1][1] -= division;
      }
    }*/


    maps[0] = this.relu(maps[0]);
    maps[1] = this.relu(maps[1]);
    maps[2] = this.relu(maps[2]);

    maps[0] = this.pooling(maps[0]);
    maps[1] = this.pooling(maps[1]);
    maps[2] = this.pooling(maps[2]);

    maps[0] = this.convolution(maps[0]);
    maps[1] = this.convolution(maps[1]);
    maps[2] = this.convolution(maps[2]);

    maps[0][0] = this.relu(maps[0][0]);
    maps[1][0] = this.relu(maps[1][0]);
    maps[2][0] = this.relu(maps[2][0]);
    maps[0][1] = this.relu(maps[0][1]);
    maps[1][1] = this.relu(maps[1][1]);
    maps[2][1] = this.relu(maps[2][1]);
    maps[0][2] = this.relu(maps[0][2]);
    maps[1][2] = this.relu(maps[1][2]);
    maps[2][2] = this.relu(maps[2][2]);

    maps[0][0] = this.pooling(maps[0][0]);
    maps[1][0] = this.pooling(maps[1][0]);
    maps[2][0] = this.pooling(maps[2][0]);
    maps[0][1] = this.pooling(maps[0][1]);
    maps[1][1] = this.pooling(maps[1][1]);
    maps[2][1] = this.pooling(maps[2][1]);
    maps[0][2] = this.pooling(maps[0][2]);
    maps[1][2] = this.pooling(maps[1][2]);
    maps[2][2] = this.pooling(maps[2][2]);

    if(test){

      this.data.push([maps[0][0], expect]);
      this.data.push([maps[0][1], expect]);
      this.data.push([maps[0][2], expect]);
      this.data.push([maps[1][0], expect]);
      this.data.push([maps[1][1], expect]);
      this.data.push([maps[1][2], expect]);
      this.data.push([maps[2][0], expect]);
      this.data.push([maps[2][1], expect]);
      this.data.push([maps[2][2], expect]);
    } else {
      console.log(maps[1][1] + " " + maps[0][2] + " " + maps[2][0]);
      return [maps[1][1], maps[0][2], maps[2][0]];
    }
  }

  grayScale(red, green, blue){
    return ((0.2125 * red) + (0.7154 * green) + (0.0721 * blue));
  }

  relu(data){
    for(var y = 0; y < data.length; y++){
      for(var x = 0; x < data[y].length; x++){
        if(data[y][x] < 0){
          data[y][x] = 0;
        }
      }
    }

    return data;
  }

  convolution(image){
    var maps = [[], [], []];

    var identity = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
    var edge = [[1, 0, -1], [0, 0, 0], [-1, 0, 1]];
    var sharpen = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];

    var slideHorizontal = image[0].length - 3;
    var slideVertical = image.length - 3;

    var startH, startV = 0;

    var result1 = 0;
    var result2 = 0;
    var result3 = 0;

    for(var i = 0; i < slideVertical; i++){
      startH = 0;
      maps[0].push([]);
      maps[1].push([]);
      maps[2].push([]);
      for(var j = 0; j < slideHorizontal; j++){
        result1 = 0;
        result2 = 0;
        result3 = 0;
        for(var y = 0; y < identity.length; y++){
          for(var x = 0; x < identity[0].length; x++){
            result1 += image[y + i][x + j] * identity[y][x];
            result2 += image[y + i][x + j] * edge[y][x];
            result3 += image[y + i][x + j] * sharpen[y][x];
            if(isNaN(image[y + i][x + j])){
              throw new Error(x + " et " + y + " et + " + i);
            }

          }
        }

        maps[0][i].push(result1);
        maps[1][i].push(result2);
        maps[2][i].push(result3);
      }
    }
    return maps;
  }

  pooling(data){
    var map = [];
    for(var y = 0; y < data.length - 1; y+=2 ){
      console.log(y);
      map.push([]);
      for(var x = 0; x < data[y].length - 1; x+=2){
        map[map.length - 1].push(Math.max(data[y][x], data[y + 1][x], data[y][x + 1], data[y + 1][x + 1]));
      }
    }
    return map;
  }

}
