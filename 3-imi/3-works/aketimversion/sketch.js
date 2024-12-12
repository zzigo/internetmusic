function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
var tempo;
var sentence; 
var sentenceArray;
var progress;

function setup(){
    tempo = 240;
   sentence = "It follows that the space she made for herself , were it the most possible approximation of itself , would produce the other her , who , following her , would then make space for her , and it therefore must be true that it would also be the best possible transfer — in other words , good enough : it would not be a matter of cutting in half , dividing , mirroring , or straddling across , but in folding herself backwards again and then backwards again , a wobble between , in which she would once again find her habitat , for this was the secret to living , which she had realized while dragging her table across the hardwood floor , revealing a scratch that she had not made , but it was clear that the scratch had been made by dragging the table across the hardwood floor , and looking up , she had seen herself , had followed her , and had become an anchor , and following in the drag of the current between herselves she watched herself sit by the window , unable to put the cup of coffee on the table , which was no longer in its place , it was clear : "
   sentenceArray = sentence.split(" ");
   progress = 0;
   setTimeout(TheFirst, 800);
}

function TheFirst(){
    setInterval(Stamp, tempo);

}

function Stamp(){

    if (mouseX != 0 && mouseY != 0){
        //make the p
        var p = document.createElement("p");
        var word = document.createTextNode(sentenceArray[progress]);
        p.appendChild(word);

        //style the p
        p.style.left = "" + mouseX + "px";
        p.style.top = "" + mouseY + "px";

        //add the p to the "container" div
        var container = document.getElementById("container");
        container.appendChild(p);
        progress++;
        if (progress >= sentenceArray.length){
            progress = 0;
        }
    }
}