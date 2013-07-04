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

  def test
  	@wat = []
  	dependencies
  	@nodes = nodeLookup(679416011)
  	@thing = []
  	@alts = []
  	@altLengths = []
  	for i in 1..3
  		tempThing = searchByNode(679416011, i, 20000, 80000)

		tempThing.xpath("//ImageSet[@Category='primary']/LargeImage/URL").each do |url|
			@thing.push(url.inner_text)

		end

		tempThing.xpath("//ImageSet[@Category='variant']/MediumImage/URL").each do |title|
	  		@alts.push(title.inner_text)
	  		
	  	end
  	end


  end

end
