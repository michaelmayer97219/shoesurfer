class HomeController < ApplicationController
	include HomeHelper
  def index



  end

  def node

  	@result = []
  	2.times do |i|
  		productsByNode(params[:id], i, 20000, 80000).each do |product|
  			@result.push(product)
  			params[:id]
  		end
  	end
  end

  def sim
    #@result = []
  	#productsByASIN(params[:asin]).each do |product|
  	#	@result.push(product)
  	#end
  	@moarResults = []
  	@result = productsByASIN(params[:id])
  	#node = nodeByASIN(params[:id])
  	@result.each do |array|
  		asin = array[7]
  		#@moarResults.push(productsByASIN(asin)) #THIS IS A COMMENT
  	end
  end

end







