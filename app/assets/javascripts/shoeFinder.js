$(document).ready(function() {

    //searchbox highlight styling

    function searchHighlight() {
        $('#search input').parent().css('background-color', 'white')
        $('#lgo, #statusBar').css('background-color', 'rgba(243,243,243, .95)')
    }

    function searchUnhighlight() {
        $('#search input').parent().css('background-color', 'rgba(243,243,243, .95)')
        $('#lgo, #statusBar').css('background-color', 'rgba(255,255,255, .95)')
        $('#searchIns').hide(100)
    }

    $('#search input').on('focus', function() {
        searchHighlight()  
    })

    $('#search input').on('blur', function() {
        searchUnhighlight()
    })

    // submission for searchbox

    $(document).on('keypress', function(e) {
        if (e.which === 13) {
            query = $('#search input').val()+' shoes'
            toFirstCall(query, 1)
        } else {
            $('#searchIns').show(100)
        }
    })

    scrollType = 'cat' //global variable for infinite scroll. To be changed on each call.
    scrollParam = 'shoes' //above is type of call, this is substance of call

    watcher = 0
    function watchForBottom(type, parameter) {
        $(window).scroll(function() {
            scrollPos = $(this).scrollTop()
            bottomPos = $(document).height() - scrollPos - $(window).height()
            if (bottomPos == 0 && watcher == 0) {
                $('#loadingBottom').show(200)
                watcher = 1
                if (scrollType == 'sim') {
                    simCall(scrollParam)
                } else if (scrollType == 'cat') {
                    catCall(scrollParam, 1)
                } else if (scrollType == 'node') {
                    nodeResultsFromASIN(scrollParam, 1)
                }

            
            }
        })
        watcher = 0
    }
    


    function containerOut () {
        $('#container').animate({'margin-left': '-100%'}, 300, function() {
            $(this).empty()
            $('#loading').show(100)
        })
    }

    function containerIn (existing, neu, callType, parameter) {
        if (existing == 0) {
            $('#container').css('margin-left', '100%')
            $('#container').animate({'margin-left': '0%'}, 150)
            $(window).scrollTop(0)
            $('#loading').hide(100)
        }

        if (callType === 'sim') {
            scrollParam = $(".action:eq("+existing+")").attr('id')
            if (scrollParam == undefined) {
                scrollParam = $(".action:eq("+(existing-1)+")").attr('id')
            }
        }

        watchForBottom(callType, parameter)
            
        settingsForContent(existing, neu)
        
    }


    //lowtech filtering
    arrayOfBadThings = ['pant', 'ethernet', 'HDMI','short sleeve', 'wallet','purse', 'sock', 'laces','goggle', 'jacket', 'smartphone', 'touchscreen', 'sunglasses','backpack','shorts','shirt','kid','toddler', 'belt', 'socks', 'glove', 'briefs', 'glasses']

    function cleanData (wrongSex, text) {
        isBad = 0
        wrongSex = wrongSex.toUpperCase()
        text = text.toUpperCase()
        if (text.indexOf(wrongSex) !== -1) {
            isBad =  1
        } 

        for (n=0; n < arrayOfBadThings.length; n++) {
            if (text.indexOf(arrayOfBadThings[n].toUpperCase()) !== -1) {
                isBad = 1
            }
        }

        return isBad
    }

    function handleSuccess(data, callType, parameter) {
        $('#loadingBottom').hide(500)
        numRows = $('.row').length
        dat = $.parseJSON(data)
        for(i = 0; i < dat.length; i++) {
                array = dat[i]
                isRight = cleanData('women',array[9])
                if ( $.inArray(array[7], alreadyShown) == -1 && isRight == 0) {
                    $('#container').append(picHTML(array))
                    $('.row').last().click(function() {
                        id = $(this).find('.action').attr('id')
                    })
                    alreadyShown.push(array[7])
                }
                
            }
            $('#padding').hide()
            $('#padding').css('top', $(document).height())
            $('#padding').show()
        newRows = $('.row').length - numRows
        containerIn(numRows, newRows, callType, parameter)
    }


    function nodeResultsFromASIN(asin) {
        $.ajax({
          url : "home/node/"+ asin,
          dataType : 'html',
          cache : false,
          success : function(data){
            existing = 0
            handleSuccess(data, 'node', asin)
            },
          error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Error!');
        }

        });

    }


    $('#headerOptions').hide()


    function backToBeginning () { 
        watcher = 1
        $('#container').hide().empty()
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

        for (inter = 0; inter<array.length; inter++) {
            if (array[inter] ==  null || array[inter] == '$0.00') {
                array[inter] = ''
            }
        }
        

        return [
            "<div class='row'>",
                "<div class='above'>",
                "<span class='prodDes'>"+array[8]+"</span>",
                "<span class='prodDesBig'>"+array[9]+"</span>",
                "</div>",
                "<div class='imgs'> ",
                    "<div class='img big'><img src=' "+array[0]+" ' /></a></div>",
                    "<div class='img'><img src=' "+array[4]+" ' /></div>",
                    "<div class='img'><img src=' "+array[3]+" ' /></div>",
                    "<div class='img'><img src=' "+array[2]+" ' /></div>",
                    "<div class='img'><img src=' "+array[1]+" ' /></div>",
                    "<a href='"+array[6]+"' target='_blank'></a>",
                "</div>",
                "<div class='below'>",
                "<div class='alternates'>.....</div>",
                "<div class='prodPrice'>"+array[5]+"</div>",
                
                "</div>",
                "<div class='action' id='"+array[7]+"'>Discover Items Like This</div>",

            "</div>",

        ].join('\n');
    }



numTimes = 0
alreadyShown = []
catpage = 1

function catCall (terms, page) {

    $.ajax({
          url : "home/shoes/"+terms+'/'+catpage,
          dataType : 'html',
          cache : false,
          success : function(data){
            handleSuccess(data, 'cat', terms)

         },
          error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Error!');
       }

   });
    catpage = catpage + 1
    scrollParam = terms
    scrollType = 'cat'
}

function toFirstCall(call, parent) {
    catpage = 1
    containerOut()
    $('#categories').hide(500)
    $('.actionCall, .firstOptions').hide(500)
    $('body').css('background-color', 'white')
    $('#container').css('margin-left', '100%')
    setTimeout(function() {
        catCall(call, 2)
        $('#container').animate({'margin-left':'0%'},1000)
        $('#statusBar').append("<span class='subCatNav navLabel'> &gt;"+" "+call+"</span>")
    }, 500)
}

$('.subCat').click(function() {    
    call = $(this).attr('id')
    parent = $(this).parent()
    toFirstCall(call, parent)
})

function nodeResultsFromExisting(option) {
            if (option == 0) {
                asin = $('.row').find('.action').last().attr('id') 
            } else { asin = option}
            nodeResultsFromASIN(asin) 
          }

function simCall (prod) {
    $.ajax({
          url : "home/sim/"+prod,
          dataType : 'html',
          cache : false,
          success : function(d){
            watcher = 0
            handleSuccess(d, 'sim', prod)
            if (d.length > 0){
                (d, 'sim')
                nodeResultsFromExisting(0)
            } else {
                nodeResultsFromExisting(prod)
            }


         /*   $('.action, .aAction').bind('click', function() {
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



            }

            else {
                nodeResultsFromASIN(prod)
            }
            */
         },
          error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Error!');
       }

   });

    scrollParam = $('.action:eq(2)').attr('id')
    console.log('scrollparam: ' + scrollParam)
    scrollType = 'sim'
}


//simCall('B004ISKHI0')

    function settingsForContent (existing, neu) {

        searchUnhighlight()
        $('#search input').val('').blur()

        $('.img').click(function() {
            link = $(this).siblings('a').attr('href')
            window.open(link, '_blank')
        })


        for(i=0; i<neu; i++) {
            newAction = $('.action').eq(i+existing)
            newAction.click(function() {
                attr = $(this).attr('id')
                containerOut()
                simCall(attr)
                alreadyShown = []
                name = $(this).siblings('.above').children('.prodDesBig').text()
                $('.prodNav').hide(50)
                $('.prodNav').empty()
                $('#statusBar').append("<span class='prodNav navLabel'> &gt;"+" "+name+"</span>")
                $('.prodNav').show(300)
            })
        }

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
                $(this).append("<span style='color:"+newRandomColor(length)+ "' >"+text[i]+"</span>")
            }
        })
    }


    xloadingColors()
    flip = 0
    setInterval(function() {
        if ( flip == 0 ){
            loadingColors()
        }
    }, 100)
    

    function newRandomColor (length) {
        diff = 75/length
        r = 255 - Math.round(diff*numb)
        g = 150 + Math.round((100/length)*numb)
        b = 200 - Math.round(diff*numb)
        return 'rgb('+r+','+g+','+b+')'
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










    /*
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

    */