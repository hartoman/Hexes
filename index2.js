$(function () {
    bindListeners();
  });

  function bindListeners(){
    $('.hex').on('click',function(){
        console.log('clicked')
    })
  }