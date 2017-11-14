# A Neural Network Prototype
This neural network is a prototype for a personal project written in javascript and can either use predictive or classification output.

## How to use

In the browser console, create a Network witb three parameters being respectively the number of neurons in the input layer, the hidden layer and the output layer like this:

```javascript
var brain = new Network(2, 5, 3); //create the network with 2 neuron in input, 5 in hidden and 3 in output layer
```

It will automatically create a Neuron object with dynamic weights for every neurons attached to it as well as two bias neurons.

Then you train the network passing an array containing arrays of two arrays for each training sample: the inputs and the expected outputs.

```javascript
var brain = new Network(2, 5, 3);
var trainingSample = [[[1, 2], [0, 1, 0]], [[5, 10], [1, 0, 0]]];
/*
You now have two samples one being
Inputs: 1 and 2 - Outputs: 0 1 0
and
Inputs: 5 and 10 - Outputs 1 0 0
*/
```

You have to choose the training function depending of if you want to teach your network for prediction or classification

```javascript
var brain = new Network(2, 5, 3);
var trainingSample = [[[1, 2], [0, 1, 0]], [[5, 10], [1, 0, 0]]];

brain.train(trainingSample); //prediction

brain.trainClass(trainingSample); //classification
```

If you choose classification you also have to put labels in your network in the order of the output neurons:

```javascript
brain.setClasses(["Dog", "Cat", "Human"]); // 1 0 0 is Dog, 0 1 0 is Cat and 0 0 1 is Human
```

When the training session is done, the program will simply return "undefined" on the web browser console, now you can test if your network has learned its lesson using either some already taught inputs or some totally new ones:

```javascript
var brain = new Network(2, 5, 3);
var trainingSample = [[[1, 2], [0, 1, 0]], [[5, 10], [1, 0, 0]]];
brain.setClasses(["Dog", "Cat", "Human"]); // if you want to use classification
brain.train(trainingSample); //only if prediction
brain.test([1, 5]); //only if prediction, will return the content of the ouputs. Here the values are chosen at random for the example

brain.trainClass(trainingSample); //only if classification
brain.testClass([5, 10]); //only if classification, will log what class the network think the parameter is binded to. Should return 'Cat'because we used already learned inputs
```

And that should do it!
