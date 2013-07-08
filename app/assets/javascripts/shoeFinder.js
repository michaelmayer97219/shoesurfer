$(document).ready(function() {

    $.ajax({
        url : "/home/sim/B0076FIG62"
        success: function(data){
           alert('success')
         }
    });


    function picHTML (src, text, price, page) {
        return [
            "<div class='img' onclick="+"window.location='"+page+"';"+" target='_new'>",
                "<div class='price'>"+price+"</div>",
                "<div class='stumbleHolder'>",
                    "<div class='shopper thang'><span class='shop'><span class='butt'>Details</span></span></div>",
                    "<div class='stub thang'><span class='stumbler'><span class='butt'>Similar</span></span></div>",
                "</div>",
                "<div class='overlay'>",
                    "<div class='label'>"+text+"</div>",
                "</div>",
                "<img src='"+src+"'/>",
            "</div>"
        ].join('\n');
    }

/*

    for (u=0; u< urls.length; u++) {
        if (prices[u] != undefined) {
            $('#imgContain').append(picHTML(urls[u], studios[u], prices[u], pages[u]))
        } else {
            console.log('error')
        }

    }

*/
    $('.img').hover(function() {
        $(this).css('background-color','white')
        $('#container').css('background-color', '#f5f5f5')
        $(this).children('.overlay').css({'top': '0px'})
        $(this).find('.label').css({'text-align': 'left'})
        $(this).children('.price').css({'text-align': 'left', 'top': '10%'})
        $(this).find('.stumbleHolder').css({'top': '80%', 'height': '20%'})
        $(this).find('.shopper').css({'height': '100%', 'width': '50%', 'background-color': 'white'})
        $(this).find('.stub').css({'height': '100%', 'width': '50%', 'background-color': ' white'})
        $(this).find('.shop').css({'font-size': '28px', 'color': '#aaa', 'line-height': '250%', 'float': 'left'})
        $(this).find('.stumbler').css({'font-size': '28px', 'color': '#aaa', 'line-height': '250%', 'left': '15px', 'width': '0px'})
        $(this).find('.butt').show()
        $(this).find('img').css({'position': 'absolute', 'max-height': '70%','max-width': '90%', 'top': '10%', 'right': '10%'})

    }, function() {
        $('#container').css('background-color', 'white')
        $(this).children('.overlay').css({'top': '70%'})
        $(this).find('.label').css({'text-align': 'center'})
        $(this).find('.stumbleHolder').css({'top': '88%', 'height': '0%'})
        $(this).children('.price').css({'text-align': 'center', 'top': '80%'})
        $(this).find('.shopper').css({'height': '0%', 'width': '50%', 'background-color': 'transparent'})
        $(this).find('.stub').css({'height': '0%', 'width': '50%', 'background-color': 'transparent'})
        $(this).find('.shop').css({'font-size': '28px', 'color': 'rgb(223, 203, 216)', 'line-height': '100%', 'float': 'left'})
        $(this).find('.stumbler').css({'font-size': '28px', 'color': 'rgba(117, 128, 86, 0.36)', 'line-height': '100%', 'width': '28px', 'right': '15px', 'left': 'auto'})
        $(this).find('.butt').hide();
        $(this).find('img').css({'position': 'static', 'max-height':'60%', 'top': '0%'})
    });    




 //   iSpread($('#imgContain'), 220, 0)

    $('#footer').hide();


    $('.optn').hover(function() {
        $(this).children('.select').show();
    }, function() {
        $(this).children('.select').hide();
    })

    //picz( 50, $('#imgContain'))
    hideImgs();
    showImgs();
    //style footer to have 10px margins
    i = 0;
    posrecord = [];
    backimage = $('#leftColumn').css('background-image')
    toggle = 0
    topTrack = 0;

    $(window).scroll(function() {
        i++
        top = $(window).scrollTop()
        posrecord.push(top.scrollY)
        tracker = ((posrecord[i-2])- posrecord[i-1])
        console.log(tracker)
        height = $('#leftColumn').height();
        
        newHeight = height + tracker;
         if (posrecord[i-1] == 0) {
            topTrack = topTrack+1 //will be odd until browser returns to zero
            console.log('toptrack = '+topTrack)
         }

         if (topTrack%2 == 0) {
            if (height >= 40 && height <= 70) {
                if (newHeight < 40) {
                    $('#lgo').css({'top': '0px'})
                    $('#goo').css({'font-size':'30px', 'margin-top': '-5px'})
                    $('.optn').css({'height': '40px', 'padding-top': '0px'})
                    $('#leftColumn').height(40)
                    $('#leftColumn').css({'margin-top': '0px'})
                }  else if (newHeight >70) {
                    $('#lgo').css({'top': '15px'})
                    $('#goo').css({'font-size':'30px', 'margin-top': '-5px'})
                    $('.optn').css({height: '40px', 'padding-top': '0px'})
                    $('#leftColumn').css({'height':'70px', 'margin-top': '10px'})
                } else {    

                }
            }
        }
        $('#leftColumn').css('opacity', height/100)

    })

    $('.lock').hover(function(){
       // $('.overlay').animate(
         //   {height: '40px',}, 
           // 200);
        $('.overlay').show();
    }, function () {
       // $('.overlay').animate(
       //     {height: '0px',}, 
       //     200);
        $('.overlay').hide(200);
    })

    function hideImgs (callback) {
        $('.img').animate({'margin-left': '120%'},500, function(){callback})
    }

    function showImgs (callback) {
        
      $('.img').animate({'margin-left': '10px'},500, function(){callback})
    }

    $('.topPiece').on('click',function() {
        hideImgs();
        showImgs();
    })

    function resizeFooter () {
        w = $(window).width()
        $('#footer').width(w-20)
        $('#preFooter').width(w-20)
    }




    lol = 0 //tracker for mousing over .piece class
    
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
    


    function sizeOptions () {
        x = 0;
        y = 0;
        diff = $('.piece').first().width();
        tDiff = $('.topPiece').first().width();
        $('.piece').each(function () { 
            $(this).css('margin-left', x)
            x = x+diff
        })

        $('.topPiece').each(function () {
            $(this).css('margin-left', y)
            y = y+tDiff
        })

    }

    sizeOptions();   

    resizeFooter()

    //function to generate random images in large 
    //quantity for design purposes
   

    //function to spread pics evenly

    function spread (element, minMarg, pixWidth) {
        maxCumMarg = pixWidth + (minMarg*2)
        numPix = Math.floor(element.width()/maxCumMarg)
        remainder = element.width() - (maxCumMarg*numPix)

        newMarg = 10 + remainder/ (numPix*2)
      //  newMarg = 10
        element.children('img').css('margin-left',newMarg)
        element.children('img').css('margin-right',newMarg)
    }
/*
    function iSpread (element, minSize, minMarg) {
        numPix = Math.floor(element.width()/(minSize+(minMarg*3)))
        newSize = ((element.width()-(numPix*minMarg*3) )/(numPix)-80)
        element.children('.img').width(newSize)
        element.children('.img').height(newSize)
        width = element.width()
        marg = $('.img').css('margin-left')
        console.log('of total width '+width+ ' pictures: '+numPix+' with width '+ newSize + 
           ' and margin '+ marg)
        console.log('diff is '+(width-(numPix*(marg+newSize))))
    }

    iSpread($('#imgContain'), 280, 0)
*/
   // spread($('#imgContain'),10)

    x = 0 //variable to stop resize funtion from tripping

    $(window).resize(function() {
        resizeFooter()
        if (x == 0) {
     //   iSpread($('#imgContain'), 220, 30)
       // spread($('#imgContain'),10, 202)
        x = 1
      }
      x = 0
    })


    
    //function picz (num, element) {
    //    for (i = 0; i<num;i++) {

      //      n = Math.floor(Math.random()*4)
        //   if (n == 0) {
      //          element.append(picHTML(urls[0], 'Fucking Shoe!'))
        //    } else if (n ==1) {
        //        element.append(picHTML(urls[5], "That Shoe!"))
       //     } else  if (n == 2) {
       //         element.append(picHTML('/assets/sample3.png', 'Blah Shoes'))
       //     } else {
         //        element.append(picHTML('/assets/sample4.jpg', 'Wat Wat What'))
         //   }
            
      //  }
    //    iSpread($('#imgContain'), 200, 100)
    //}


    $('.img').each(function() {
       // price = '$'+Math.floor(Math.random()*100)
       // $(this).append("<div class='price'>"+prices[u]+"</div>")
    })




    
/* 
    strOriginalQuery = "http://ecs.amazonaws.com/onca/xml?AWSAccessKeyId=AKIAIDF25W65W3YRQXTQ&AssociateTag=pershofin-20&Keywords=harry%20potter%20&Operation=ItemSearch&SearchIndex=Books&Service=AWSECommerceService"
   // console.log(strOriginalQuery)
    strSignedQuery = AWSQS.signQuery( strOriginalQuery, '8NDDltJgk/v4iJyUZeRQt+YcoH7/Er8pVPGZ98Xo' );
    console.log(strSignedQuery)

    xml = invokeRequest();

   $('body').click(function() {
        $.get(xml, function(data) {
         //alert("Data Loaded: " + data);
         stuff = $.parseXML(data)
         $data = $(stuff)
         console.log($data.find('description'))
    });
       console.log(xml)
    })

    */
})