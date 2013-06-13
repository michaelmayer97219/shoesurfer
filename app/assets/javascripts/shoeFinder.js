$(document).ready(function() {

    $('#footer').hide();

    xml = $('#xml').text()
    console.log(xml)

    picz( 50, $('#imgContain'))
    hideImgs();
    showImgs();
    //style footer to have 10px margins

    $('.lock').hover(function(){
        $('.overlay').animate(
            {height: '40px',}, 
            200);
        $('.overlay').show();
    }, function () {
        $('.overlay').animate(
            {height: '0px',}, 
            200);
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


    $('.img').mouseenter(function() {
        $(this).children('.overlay').animate(
            {height: '40px',}, 
            200);
        $(this).find('.overlay').show();
    }) 

    $('.img').mouseleave(function() {
        $(this).children('.overlay').animate(
            {height: '0%'}, 
            200);
        $(this).find('.overlay').hide(200);
    });    

    lol = 0 //tracker for mousing over .piece class
    /*
    $('.piece').hover(function() {
        $('.piece').removeClass('arrow') 
        $(this).addClass('arrow')
        $('#preFooter').show();

        
        
    }, function() {
        $('body').mousemove(function() {
            posy = event.clientY
            posx = event.clientX
            fromLeft = $(window).width() - posx
            fromBottom = $(window).height() - posy
            console.log(fromLeft)
            if (fromBottom > 180) {
                $('#preFooter').hide();

                $('.piece').removeClass('arrow')
            } else if (fromBottom < 90 && fromLeft < 300 ) {
                $('#preFooter').hide();
                $('.piece').removeClass('arrow')
            }
        })
    })
    */


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
        console.log('new marg is'+newMarg+'numPix is'+numPix)
      //  newMarg = 10
        element.children('img').css('margin-left',newMarg)
        element.children('img').css('margin-right',newMarg)
    }

    function iSpread (element, minSize, minMarg) {
        numPix = Math.floor(element.width()/(minSize+(minMarg*3)))
        newSize = (element.width()-(numPix*minMarg*3) )/(numPix)
        console.log(numPix+' pictures at '+newSize)
        element.children('.img').width(newSize)
        element.children('.img').height(newSize)
    }

    iSpread($('#imgContain'), 200, 10)

   // spread($('#imgContain'),10)

    x = 0 //variable to stop resize funtion from tripping

    $(window).resize(function() {
        resizeFooter()
        if (x == 0) {
        iSpread($('#imgContain'), 200, 10)
       // spread($('#imgContain'),10, 202)
        x = 1
      }
      x = 0
    })

    function picHTML (src, text) {
        return "<div class='img'><div class='overlay'><div class='label'>"+text+"</div><div class='thumb up' ></div><div class='thumb down' ></div></div><img src='"+src+"'/></div>"
    }

    function picz (num, element) {
        for (i = 0; i<num;i++) {

            n = Math.floor(Math.random()*6)
           if (n == 0) {
                element.append(picHTML("http://www.toms-shoes-outlet-onlines.com/images/Women-Toms-Classic-Shoes-Classic-Women-Black-Stripe.jpg", "Tom's $100"))
            } else if (n ==1) {
                element.append(picHTML('http://ww1.prweb.com/prfiles/2008/10/15/261416/fallanimal.jpg', "Something $120"))
            } else {
                element.append(picHTML('http://i.ebayimg.com/00/s/MTUwMFgxNTAw/z/SZQAAOxyY9VRNWDY/$T2eC16NHJHYE9nzpcwl9BRNWDYD+rQ~~60_1.JPG?set_id=8800005007', 'Blah $75'))
            }
            
        }
        iSpread($('#imgContain'), 200, 10)
    }

    $('.img').each(function() {
        price = '$'+Math.floor(Math.random()*100)
        $(this).append("<div class='price'>"+price+"</div>")
        console.log(price)
    })


    /*
    

    strOriginalQuery = "http://ecs.amazonaws.com/onca/xml?AWSAccessKeyId=AKIAIDF25W65W3YRQXTQ&AssociateTag=pershofin-20&Keywords=harry%20potter%20&Operation=ItemSearch&SearchIndex=Books&Service=AWSECommerceService"

console.log(strOriginalQuery)

    strSignedQuery = AWSQS.signQuery( strOriginalQuery, '8NDDltJgk/v4iJyUZeRQt+YcoH7/Er8pVPGZ98Xo' );

    console.log(strSignedQuery)

    xml = invokeRequest();

  

    $.get(xml, function(data) {
      //alert("Data Loaded: " + data);
      stuff = $.parseXML(data)
      $data = $(stuff)
      console.log($data.find('description'))
    });
    console.log(xml)
*/
})