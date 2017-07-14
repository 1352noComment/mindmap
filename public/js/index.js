  $(document).ready(function() {

    $("[data-toggle=popover]")
    .popover({html:true})


    $('.popover-markup>.trigger').popover({
      html: true,
      title: function () {
        return $(this).parent().find('.head').html();
      },
      content: function () {
        return $(this).parent().find('.content').html();
      }
    });

  //Contact Form Popup

  $('#contact').click(function() {
    $('#contactForm').fadeToggle();
  });

  $(document).mouseup(function (e) {
    var container = $("#contactForm");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
      container.fadeOut();
    }
  });

  //Feature Description Animation

  $('.description-mindmap').hide();
  $('.description-calendar').hide();

  $('#calendar').on("mouseenter", function(){
    $('.description-calendar').show('slow');
  });

  $('#calendar').on("mouseleave", function(){
    $('.description-calendar').hide('slow');
  });

  $('#mindmap').on("mouseenter", function(){
    $('.description-mindmap').show('slow');
  });

  $('#mindmap').on("mouseleave", function(){
    $('.description-mindmap').hide('slow');
  });

  //Front Page Slideshow

  $('.mySlideshows').cycle();

});