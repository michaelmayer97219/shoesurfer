class HomeController < ApplicationController
	include HomeHelper
  def index
  	dependencies
	xml_doc  = simLookup('B0084BS8BA')
	@returned_xml = []
	 xml_doc.xpath("//ASIN").each do |obj|
		 asin = obj.inner_text 
	 @returned_xml.push(simLookup(asin))
	end

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
  	@result = productsByASIN(params[:id])
  	node = nodeByASIN(params[:id])
  	rand = 1 + rand(2) #to prevent repetitive views 
  	if node.length > 1
  	x = rand(2)
  else 
  	x = 0
  end
  	@resultsByNode = productsByNode(node[x], rand, 2000, 10000)
  end

end







