$(document).ready(function() {


    function picHTML (array) {
        return [
            "<div class='row'>",
                "<div class='above'>",
                "<span class='prodDes'>"+array[8]+"</span>",
                "<span class='prodDesBig'>"+array[9]+"</span>",
                "</div>",
                "<div class='imgs'> ",
                    "<div class='img'><img src=' "+array[1]+" ' /></div>",
                    "<div class='img'><img src=' "+array[2]+" ' /></div>",
                    "<div class='img big'><img src=' "+array[0]+" ' /></div>",
                    "<div class='img'><img src=' "+array[3]+" ' /></div>",
                    "<div class='img'><img src=' "+array[4]+" ' /></div>",
                "</div>",
                "<div class='below'>",
                "<div class='alternates'>.....</div>",
                "<div class='prodPrice'>"+array[5]+"</div>",
                
                "</div>",
                "<div class='action' id='"+array[7]+"'>Discover</div>",

            "</div>",

        ].join('\n');
    }

numTimes = 0
alreadyShown = []
function simCall (asin) {

    $.ajax({
          url : "home/sim/"+asin,
          dataType : 'html',
          cache : false,
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
                $('.row').hover(function () {
                    $(this).find('.action').show()
                    $(this).find('.prodDes').hide(100);

                    setTimeout($(this).find('.prodDesBig').show(100),100)
                }, function() {
                    $(this).find('.action').hide()
                    $(this).find('.prodDesBig').hide(100);
                    setTimeout($(this).find('.prodDes').show(100),100)
                })
                $('.img').hover(function() {
                    $(this).css({'height': '100%', 'width': '40%','opacity': 1})
                    $(this).siblings('.img').css({'height': '40%', 'width': '10%', 'opacity': 0.1})
                    $(this).siblings('.img').animate({'opacity': 1},500)
                        centerImgInContainer()
                }, function() {
                    //$(this).css({'height': '40%', 'width': '10%'})
                    //$(this).siblings('img').css({'height': '40%'})
                    //$(this).siblings().first().css({'max-height': '100%'})
                })

                $('.prodDesBig, .prodDes').each(function () {
                    text = $(this).text()
                    length = text.length
                    $(this).empty()

                    diff = 100/length
                    
                    for (i = 0; i < length; i++) {
                        newTint = Math.round(diff*i)
                        newColor = 'rgb('+newTint+','+newTint+','+newTint+')'
                        $(this).append("<span style='color:"+newColor+ "' >"+text[i]+"</span>")
                    }
                })

                $('.action').bind('click', function() {
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


simCall('B005B91IRY')





    numb = 0
    $('#goo').children('span').each(function() {
        length = $('#goo').children('span').size()

        diff = 150/length
        r = 255 - Math.round(diff*numb)
        g = 100 + Math.round((155/length)*numb)
        b = 150 - Math.round(diff*numb)

        newColor = 'rgba('+255+','+g+','+b+')'
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