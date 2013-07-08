$(document).ready(function() {


    function picHTML (array) {
        return [
            "<div class='row'>",
                "<div class='imgs'> ",
                    "<div class='img'><img src=' "+array[1]+" ' /></div>",
                    "<div class='img big'><img src=' "+array[0]+" ' /></div>",
                    "<div class='img'><img src=' "+array[2]+" ' /></div>",
                    "<div class='img'><img src=' "+array[3]+" ' /></div>",
                    "<div class='img'><img src=' "+array[4]+" ' /></div>",
                "</div>",
            "</div>",
            "<div class='attr' id='"+array[7]+"'>"+array[7]+"</div>",

        ].join('\n');
    }

numTimes = 0
alreadyShown = []
function simCall (asin) {

    $.ajax({
          url : "home/sim/"+asin,
          dataType : 'html',
          success : function(data){
            dat = $.parseJSON(data)
            for(i = 0; i < dat.length; i++) {

                array = dat[i]
                if ( $.inArray(array[7], alreadyShown) == -1) {
                    $('#container').append(picHTML(array))
                    alreadyShown.push(array[7])
                } else {

                }
                
            }

            for(i = 0; i < dat.length; i++) {
                if (numTimes < 3) {
                array = dat[i]
                simCall(array[7])      
                numTimes ++       
                }
             }
                centerImgInContainer ()

                $('.img').hover(function() {
                    $(this).css({'height': '100%', 'width': '30%'})
                    $(this).siblings('.img').css({'height': '40%', 'width': '10%'}, 100)
                        centerImgInContainer()
                }, function() {
                    //$(this).css({'height': '40%', 'width': '10%'})
                    //$(this).siblings('img').css({'height': '40%'})
                    //$(this).siblings().first().css({'max-height': '100%'})
                })
                    $('.attr').bind('click', function() {
                        attr = $(this).attr('id')
                        $('#container').empty()
                        simCall(attr)
                        alreadyShown = []
                })
         },
          error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Error!');
       }

   });





}


simCall('B0076FIG62')





    numb = 0
    $('#goo').children('span').each(function() {
        length = $('#goo').children('span').size()
        diff = 150/length
        faded = 75+ Math.round(diff*numb)
        unfaded = 150 - Math.round(diff*numb)
        console.log(faded)
        newColor = 'rgba('+unfaded+','+faded+','+unfaded+')'
        $(this).css('color', newColor)
        numb = numb + 1
    })


    function centerImgInContainer () {

        $('.img').each(function() {
            containWidth = $(this).width() 
            imgWidth = $(this).children().width()
            diff = containWidth - imgWidth
            $(this).children().css('margin-left', diff/2)
            //$(this).css('background-color', 'black')
        })


    }



    $('.optn').hover(function() {
        $('.optn').removeClass('arrow') 
        $(this).addClass('arrow')   

    }, function() {
         $('.optn').removeClass('arrow')
        $('body').mousemove(function() {
            posy = event.clientY
            posx = event.clientX
            fromLeft = $(window).width() - posx
            fromBottom = $(window).height() - posy
           // console.log(fromLeft)

            if (fromBottom > 180) {

                $('.piece').removeClass('arrow')
            } else if (fromBottom < 90 && fromLeft < 300 ) {
        
               
            }
        })
    })
    

})