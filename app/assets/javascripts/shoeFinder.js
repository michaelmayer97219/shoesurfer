$(document).ready(function() {


    function backToBeginning () { 
        $('#container').hide()
        $('#categories').show(300)
        $('#categories').css({'top': '100%', 'margin-top': '80px'})
        $('.actionCall').show(300)
        $('#statusBar').hide()
        $('.firstOptions').show(300) 
        $(window).scrollTop(0)
        $('body').css('background-color', '#efefef')
        $('#categories').children().each(function () {
            $(this).show()
            $(this).css({'width': '49%', 'margin': '0px'})
        })

    }

    $('.homeLabel').click(function() {
        backToBeginning()
    })

    $('#goo').click(function() {
        backToBeginning()
    })


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
                "<div class='action' id='"+array[7]+"'>Discover Items Like This</div>",

            "</div>",

        ].join('\n');
    }

    function apparelPicHTML (array) {

        imgs = []
        imgHTML = ''
        for (i = 0; i < 5; i++) {
            if ( $.inArray(array[i], imgs) == -1) {
              imgs.push(array[i])  
            }
        }
        length = imgs.length
        if (imgs.length > 3) {
            for (i=0; i< length;i++) {

            }
        }

        return [
            "<div class='aRow'>",
                "<div class='aAbove'>",
                "<span class='aProdDes'>"+array[8]+"</span>",
                "<span class='aProdDesBig'>"+array[9]+"</span>",
                "</div>",
                "<div class='aImgs'> ",
                    "<div class='aImg'><img src=' "+array[1]+" ' /></div>",
                    "<div class='aImg'><img src=' "+array[2]+" ' /></div>",
                    "<div class='aImg aBig'><img src=' "+array[0]+" ' /></div>",
                    "<div class='aImg'><img src=' "+array[3]+" ' /></div>",
                    "<div class='aImg'><img src=' "+array[4]+" ' /></div>",
                "</div>",
                "<div class='aBelow'>",
                "<div class='aAlternates'>.....</div>",
                "<div class='aProdPrice'>"+array[5]+"</div>",
                
                "</div>",
                "<div class='aAction' id='"+array[7]+"'>Discover Items Like This</div>",

            "</div>",

        ].join('\n');
    }

numTimes = 0
alreadyShown = []

function catCall (terms) {
    $.ajax({
          url : "home/shoes/"+terms,
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

             settingsForContent()
             $('.prodNav').css('color', 'blue')
            $('.action, .aAction').bind('click', function() {
                    attr = $(this).attr('id')
                    $('#container').empty()
                    simCall(attr)
                    alreadyShown = []
                    name = $(this).siblings('.aAbove').children('.aProdDesBig').text()
                    $('.prodNav').hide(50)
                    $('.prodNav').empty()
                    $('#statusBar').append("<span class='prodNav navLabel'> &gt;"+" "+name+"</span>")
                    $('.prodNav').show(300)
                                        
            })
         },
          error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Error!');
       }

   });
}

$('.subCat').click(function() {
    call = $(this).attr('id')
    parent = $(this).parent()
    $('#categories').hide(500)
    $('.actionCall, .firstOptions').hide(500)
    $('body').css('background-color', 'white')
    $('#container').css('margin-left', '100%')
    setTimeout(function() {
        catCall(call)
        $('#container').animate({'margin-left':'0%'},1000)
        $('#statusBar').append("<span class='subCatNav navLabel'> &gt;"+" "+call+"</span>")
    }, 500)
})

function simCall (prod) {
    $.ajax({
          url : "home/sim/"+prod,
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

             settingsForContent()

            $('.action, .aAction').bind('click', function() {
                    attr = $(this).attr('id')
                    $('#container').empty()
                    simCall(attr)
                    alreadyShown = []
                    name = $(this).siblings('.aAbove').children('.aProdDesBig').text()
                    $('.prodNav').empty()
                    $('.prodNav').hide(50)
                    $('#statusBar').append("<span class='prodNav navLabel'> &gt;"+" "+name+"</span>")
                    $('.prodNav').show(300)
            })
         },
          error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Error!');
       }

   });
}


//simCall('B004ISKHI0')

    function settingsForContent () {
                $('#container').show()
                updateLoadingPos()
                centerImgInContainer ()
                $('.row, .aRow').hover(function () {
                    $(this).find('.action, .aAction').show()
                    $(this).find('.prodDes, .aProdDes').hide(100);

                    setTimeout($(this).find('.prodDesBig, .aProdDesBig').show(100),100)
                }, function() {
                    $(this).find('.action, .aAction').hide()
                    $(this).find('.prodDesBig, .aProdDesBig').hide(100);
                    setTimeout($(this).find('.prodDes, .aProdDes').show(100),100)
                })
                $('.img, .aImg').hover(function() {
                    $(this).css({'height': '100%', 'width': '40%','opacity': .5})
                    $(this).siblings('.img, .aImg').css({'height': '40%', 'width': '10%', 'opacity': .2})
                    $('.img, .aImg').animate({'opacity': 1} ,500)
                        centerImgInContainer($('.img, .aImg'), 2)
                }, function() {
                    //$(this).css({'height': '40%', 'width': '10%'})
                    //$(this).siblings('img').css({'height': '40%'})
                    //$(this).siblings().first().css({'max-height': '100%'})
                })

              /*  $('.prodDesBig, .prodDes, .aProdDes, .aProdDesBig').each(function () {
                    text = $(this).text()
                    length = text.length
                    $(this).empty()

                    diff = 50/length
                    
                    for (i = 0; i < length; i++) {
                        newTint = 255 - Math.round(diff*i)
                        newColor = 'rgb('+newTint+','+newTint+','+newTint+')'
                        $(this).append("<span style='color:"+newColor+ "' >"+text[i]+"</span>")
                    }
                })
                */

    }



    numb = 0


    $('#goo').children('span').each(function() {
        length = $('#goo').children('span').size()

        diff = 75/length
        r = 255 - Math.round(diff*numb)
        g = 150 + Math.round((100/length)*numb)
        b = 200 - Math.round(diff*numb)

        newColor = 'rgba('+255+','+g+','+b+')'
        $(this).css('color', newColor)
        numb = numb + 1
    })

    function sex (which) {
        $('.firstOptions').hide(300)
        $('.actionCall').first().hide(300)
        setTimeout(function() {
            text = which
            $('#statusBar').show(300)
            $('#statusBar').html("<span class='homeLabel navLabel'>Home</span><span id='"+text+"' class='sexLabel navLabel'>  &gt; "+text+"</span>")
            $('.or').hide()
            $('#categories').animate({'top': '100px', 'margin-top': '3%'},500)
            if (text == 'Men') {
                $('#woCat').hide(700)
                $('#menCat').css('border', '0px solid black')
                centerImgInContainer($('#categories'),2)
            } else {
                $('#menCat').hide(700)
                centerImgInContainer($('#categories'),2)
            }
        }, 0)
    }

    $('.firstImageHolder').click(function() {
      text = $(this).find('.startLabel').text()
      sex(text)
       $('.sexLabel').click(function() {
        text = $(this).attr('id')
        alert(text)
        sex(text)
        })
    })




    $('.subCat').each(function() {
        $(this).hover(function() {
            $(this).siblings().css('opacity', .5)
        }, function () {
            $(this).siblings().css('opacity', 1)
        })
    })


    function centerImgInContainer (node, x) {

        $(node).each(function() {
            containWidth = $(this).width() 
            imgWidth = $(this).children().width()
            diff = containWidth - imgWidth
            $(this).children().css('margin-left', diff/x)
            //$(this).css('background-color', 'black')
        })


    }

    centerImgInContainer($('.firstImageHolder'), 8)

    function updateLoadingPos () {
        h = $(document).height()
        wh = $(window).height()
        h = h - wh*1.1
        $('#loading').css('top', h)
    }

    //updateLoadingPos()

    function loadingColors() {

        $('#loading').each(function () {
            text = $(this).text()
            length = text.length
            $(this).empty()

            diff = 100/length
            
            for (i = 0; i < length; i++) {
                $(this).append("<span style='color:"+newRandomColor(150, 50)+ "' >"+text[i]+"</span>")
            }
        })
    }


    loadingColors()
    flip = 0
    setInterval(function() {
        if ( flip == 0 ){
            loadingColors()
        }
    }, 100)
    

    function newRandomColor (floor, breadth) {
        r = Math.floor(Math.random()*breadth)+floor
        g = Math.floor(Math.random()*breadth)+floor
        b = floor - Math.floor(Math.random()*breadth)
        return 'rgb('+255+','+g+','+b+')'
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

    $('.firstImageHolder').hover(function() {
        $(this).siblings().css('opacity',.6)
        $(this).find('.startLabel').css({'right': '0px', 'top':'45%', 'font-size': '35px'})
    }, function() {
        $(this).siblings().css('opacity',1)
        $(this).find('.startLabel').css({'right': 'auto', 'top':'auto', 'font-size': '22px'})

    })
    


})