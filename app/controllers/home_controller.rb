class HomeController < ApplicationController
	include HomeHelper
  def index

  	@var = productsByASIN(params[:id])
    @women = singleItemByAsin('B00C9UNUNI')
    @men = singleItemByAsin('B0059MSZOC')
  end

  def node
  	#@result = []
  	#@result = productsByNode(params[:id], 1, 20000, 80000)
    @result = fromIdToNodeResults('B00C9UNUNI')
    respond_to do |format|
      format.js { render :json => @result}
    end
  end

  def sim
    expires_in 1.seconds
    #@result = []
  	#productsByASIN(params[:asin]).each do |product|
  	#	@result.push(product)
  	#end
  	@moarResults = []
  	@result = productsByASIN(params[:id])
  	#node = nodeByASIN(params[:id])
  	#@result.each do |array|
  		#asin = array[7]
  		#@moarResults.push(productsByASIN(asin)) #THIS IS A COMMENT
  	respond_to do |format|
  		format.js { render :json => @result}
  	end
  end

  def apparel
    @result = productsByTerms('Apparel', params[:id])
    respond_to do |format|
      format.js { render :json => @result}
    end
  end

  def shoes
    expires_in 1.seconds
    paras = params[:id].split('/')
    @result = productsByTerms('Shoes', paras[0], paras[1])
    respond_to do |format|

          format.js { render :json => @result}
    end
  end

  def cart
    
  
  end


end







