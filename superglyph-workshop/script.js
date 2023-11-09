

let weightSlider = document.getElementById("weight-slider");

let fontWeight = document.getElementById("font", "fonttwo");

weightSlider.oninput = function() {
  fontWeight.style.setProperty('font-weight',weightSlider.value.toString(10)) 
}




  function fillCode() {
    editable2.innerHTML = textareaCSS2.value;
    document.querySelector('.demo2').style.setProperty('--text-axis', 88);

    editable3.innerHTML = textareaCSS3.value;
    document.querySelector('.demo3').style.setProperty('--wght-axis', 400);

  }

  // get the inputs
  const inputs = [].slice.call(document.querySelectorAll('.demo2 .controls input'));


  // listen for changes
  inputs.forEach(input => input.addEventListener('change', handleUpdate));
  inputs.forEach(input => input.addEventListener('mousemove', handleUpdate));

  function handleUpdate(e) {
    document.querySelector('.demo2').style.setProperty(`--${this.id}`, this.value);
    document.querySelector('.demo3').style.setProperty(`--${this.id}`, this.value);
  }



  var rangeinput = document.querySelector('.controls--slider');

  function fillCode() {

  }

