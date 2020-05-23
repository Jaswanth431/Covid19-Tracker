$(document).ready(()=>{
  $(".toggle-menu").click(()=>{
    var ele = $(".toggle-menu").hasClass("added");
    if(ele){
      $(".toggle-menu").removeClass("added");
      $(".navigation").removeClass("add-navigation");
      $(".line1").removeClass("add-line1");
      $(".line2").removeClass("add-line2");
      $(".line3").removeClass("add-line3");

    }else{
      $(".toggle-menu").addClass("added");
      $(".navigation").addClass("add-navigation");
      $(".line1").addClass("add-line1");
      $(".line2").addClass("add-line2");
      $(".line3").addClass("add-line3");
    }
  });
});