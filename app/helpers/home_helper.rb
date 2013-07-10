module HomeHelper

	def dependencies 
		return require 'yaml' 
		return require 'vacuum' 
		return require 'nokogiri' 
	end

	def newVacuum(params)
		v = Vacuum.new
		v.configure(
			key:    'AKIAIDF25W65W3YRQXTQ',  
			secret: '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', 
		    tag:    'pershofin-20') 
		return v.get(query: params)
	end

	def nokogiri(object)
		return Nokogiri::XML(object.body).remove_namespaces! 
	end

	def nodeLookup(node)
		params = {  
		  'Operation'     => 'BrowseNodeLookup',
		  'BrowseNodeId'    =>  node,
		  'ResponseGroup' => ''}  
		result = newVacuum(params)
		return nokogiri(result)
	end

	def simLookup(asin)
		params = {  
		  'Operation'     => 'SimilarityLookup',  
		  'SearchIndex'   => 'Shoes',
		  'IdType'        => 'ASIN', 
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes, Similarities', 
		  'ItemId'        => asin}  
		result = newVacuum(params)
		return nokogiri(result)
	end




	def singleItemByAsin(asin)
		dependencies
		params = {  
		  'Operation'     => 'ItemLookup',
		  'ItemId'    =>  asin,
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes, Similarities, VariationImages'}  
		result = newVacuum(params)
		return nokogiri(result).xpath("//ImageSet[@Category='primary']/LargeImage/URL")
	end

	def searchByNode(node, page, minPrice, maxPrice)
		params = {  
		  'Operation'     => 'ItemSearch',
		  'SearchIndex'   => 'Shoes',
		  'BrowseNode'    =>  node,
		  'MaximumPrice'  =>  maxPrice,
		  'MinimumPrice'  => minPrice,
		  'keywords'    => 'shoe',
		  'ItemPage'    =>  page,
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes'}  
		result = newVacuum(params)
		return nokogiri(result)
	end

	def termSearch(index, terms)
		params = {  
		  'Operation'     => 'ItemSearch',
		  'SearchIndex'   => index,
		  'Keywords'    =>  terms,
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes, Similarities'}  
		result = newVacuum(params)
		return nokogiri(result)
	end

	def productsByTerms(index, terms) 

		dependencies
		asins = []
		itemShort = []
		itemLong = [] 
		pages = []
	  	thing = []
	  	@prices = []
	  	alts = []
	  	blah = 0
	  	xx = 1
  		tempThing = termSearch(index, terms)	

  		tempThing.xpath("//FormattedPrice").each do |price|
			@prices.push(price.inner_text)
		end

		tempThing.xpath("//Studio").each do |short|
			itemShort.push(short.inner_text)
		end

		tempThing.xpath("//ItemAttributes/Title").each do |long|
			itemLong.push(long.inner_text)
		end

  		tempThing.xpath("//ASIN").each do |asin|
			asins.push(asin.inner_text)
		end

		tempThing.xpath("//DetailPageURL").each do |page|
			pages.push(page.inner_text)
		end

		tempThing.xpath("//ImageSet[@Category='primary']/LargeImage/URL").each do |url|
			temp = []
			temp.push(url.inner_text)
			temp.push(xx)
			thing.push(temp)
			xx = xx+1
		end

		(xx).times do |i|
			temptemp = []
			#tempThing.xpath("//Item["+i.to_s+"]/ImageSets/ImageSet[@Category='variant']/MediumImage/URL").each do |title|
			tempThing.xpath("//Item["+i.to_s+"]/ImageSets/ImageSet[@Category='variant']/LargeImage/URL").each do |title|
				temp = []
	  			temp.push(title.inner_text)
	  			temp.push(i)
	  			temptemp.push(temp)
	  		end
	  		alts.push(temptemp)
  		end


	  	result = []
	  	thing.length.times do |i|

	  			cont = []

	  			cont.push(thing[i][0])

	  			4.times do |n|
		  			if alts[i+1][n].nil? == false
			  			cont.push(alts[i+1][n][0])

		  			else 
			   			cont.push(thing[i][0])

		  			end
		  		end
	  			cont.push(@prices[i])
	  			cont.push(pages[i])
	  			cont.push(asins[i])
	  			cont.push(itemShort[i])
	  			cont.push(itemLong[i])
	  			result.push(cont)

	  end
	  return result
	end

	def productsByNode(node, page, minPrice, maxPrice)
		  	
		dependencies
		asins = []
		pages = []
	  	thing = []
	  	@prices = []
	  	alts = []
	  	blah = 0
	  	xx = 1
  		tempThing = searchByNode(node, page, minPrice, maxPrice)	

  		tempThing.xpath("//FormattedPrice").each do |price|
			@prices.push(price.inner_text)
		end

		tempThing.xpath("//ASIN").each do |asin|
			asins.push(asin.inner_text)
		end

		tempThing.xpath("//DetailPageURL").each do |page|
			pages.push(page.inner_text)
		end

		tempThing.xpath("//ImageSet[@Category='primary']/LargeImage/URL").each do |url|
			temp = []
			temp.push(url.inner_text)
			temp.push(xx)
			thing.push(temp)
			xx = xx+1
		end

		(xx).times do |i|
			temptemp = []
			tempThing.xpath("//Item["+i.to_s+"]/ImageSets/ImageSet[@Category='variant']/MediumImage/URL").each do |title|
				temp = []
	  			temp.push(title.inner_text)
	  			temp.push(i)
	  			temptemp.push(temp)
	  		end
	  		alts.push(temptemp)
  		end


	  	result = []
	  	thing.length.times do |i|

	  			cont = []

	  			cont.push(thing[i][0])
	  			if alts[i+1][3].nil? == false
		  			cont.push(alts[i+1][0][0])
		  			cont.push(alts[i+1][1][0])
		  			cont.push(alts[i+1][2][0])
		  			cont.push(alts[i+1][3][0])
	  			else 
		   			cont.push(thing[i][0])
		  			cont.push(thing[i][0])
		  			cont.push(thing[i][0])
		  			cont.push(thing[i][0])
	  			end
	  			cont.push(@prices[i])
	  			cont.push(pages[i])
	  			cont.push(asins[i])
	  			result.push(cont)


	  end
	  return result
	end

	def nodeByASIN(asin)
		params = {  
		  'Operation'     => 'ItemLookup',
		  'ItemId'        => asin,
		  'ResponseGroup' => 'BrowseNodes'}  
		result = newVacuum(params)
		noko =  nokogiri(result)
		res = [] 
		noko.xpath("//BrowseNodeId").each do |ass|
			res.push(ass.inner_text)
		end
		return res 
	end

	def productsByASIN(asin)
		  	
		dependencies
		asins = []
		itemShort = []
		itemLong = [] 
		pages = []
	  	thing = []
	  	@prices = []
	  	alts = []
	  	blah = 0
	  	xx = 1
  		tempThing = simLookup(asin)	

  		tempThing.xpath("//FormattedPrice").each do |price|
			@prices.push(price.inner_text)
		end

		tempThing.xpath("//Studio").each do |short|
			itemShort.push(short.inner_text)
		end

		tempThing.xpath("//ItemAttributes/Title").each do |long|
			itemLong.push(long.inner_text)
		end

  		tempThing.xpath("//ASIN").each do |asin|
			asins.push(asin.inner_text)
		end

		tempThing.xpath("//DetailPageURL").each do |page|
			pages.push(page.inner_text)
		end

		tempThing.xpath("//ImageSet[@Category='primary']/LargeImage/URL").each do |url|
			temp = []
			temp.push(url.inner_text)
			temp.push(xx)
			thing.push(temp)
			xx = xx+1
		end

		(xx).times do |i|
			temptemp = []
			#tempThing.xpath("//Item["+i.to_s+"]/ImageSets/ImageSet[@Category='variant']/MediumImage/URL").each do |title|
			tempThing.xpath("//Item["+i.to_s+"]/ImageSets/ImageSet[@Category='variant']/LargeImage/URL").each do |title|
				temp = []
	  			temp.push(title.inner_text)
	  			temp.push(i)
	  			temptemp.push(temp)
	  		end
	  		alts.push(temptemp)
  		end


	  	result = []
	  	thing.length.times do |i|

	  			cont = []

	  			cont.push(thing[i][0])
	  			if alts[i+1][3].nil? == false
		  			cont.push(alts[i+1][0][0])
		  			cont.push(alts[i+1][1][0])
		  			cont.push(alts[i+1][2][0])
		  			cont.push(alts[i+1][3][0])
	  			else 
		   			cont.push(thing[i][0])
		  			cont.push(thing[i][0])
		  			cont.push(thing[i][0])
		  			cont.push(thing[i][0])
	  			end
	  			cont.push(@prices[i])
	  			cont.push(pages[i])
	  			cont.push(asins[i])
	  			cont.push(itemShort[i])
	  			cont.push(itemLong[i])
	  			result.push(cont)


	  end
	  return result
	end

	def searchByTerms(terms, page, minPrice, maxPrice)
		params = {  
		  'Operation'     => 'ItemSearch',
		  'SearchIndex'   => 'Shoes',
		  'Keywords'    =>  terms,
		  'brand' => 'michael antonio',
		  #'MaximumPrice'  =>  maxPrice,
		  #'MinimumPrice'  => minPrice,
		  'ItemPage'    =>  page,
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes'}  
		result = newVacuum(params)
		return nokogiri(result)
	end


	def returnInfo(xml) 
		asins = Array.new
		pages = Array.new
		urls = Array.new
		studios = Array.new
		titles = Array.new
		prices = Array.new
		items = [asins, pages, urls, studios, titles, prices]
		newitems = []

		xml.xpath("//Item/ASIN").each do |as| 
			asins.push(as.inner_text)
		end 

		xml.xpath("//DetailPageURL").each do |page| 
			pages.push(page.inner_text)
		end 

		xml.xpath("//ImageSet[@Category='primary']/LargeImage/URL").each do |url| 
			urls.push(url.inner_text)
		end 

		xml.xpath("//Studio").each do |studio| 
			studios.push(studio.inner_text)
		end 

		xml.xpath("//Title").each do |title| 
			titles.push(title.inner_text)
		end 

		xml.xpath("//FormattedPrice").each do |price| 
			prices.push(price.inner_text)
		end 
		return items
	end

	def genArrayOfSimilarities(asin) 
		holder = []
		xml_doc  = simLookup(asin)

	 	xml_doc.xpath("//ASIN").each do |obj| 
	 		ass = obj.inner_text
	 		inst = simLookup(ass)
	 		holder.push(returnInfo(inst))
	 	end

	 	final = [[],[],[],[],[],[]]

	 	holder.each do |array|
	 		i = 0
	 		array.each do |smallarray|
	 			
	 			smallarray.each do |obj|
	 				final[i].push(obj)
	 				
	 			end
	 			i = i+1
	 		end
	 	end
	 	return final
	 end

	 def imageContain(asin, page, url, studio, title, price)
	 	return [
            "<div class='img' onclick="+"window.location='"+page+"';"+" target='_new'>",
                "<div class='price'>"+price+"</div>",
                "<div class='stumbleHolder'>",
                    "<div class='shopper thang'><span class='shop'><span class='butt'>Details</span></span></div>",
                    "<div class='stub thang'><span class='stumbler'><span class='butt'>Similar</span></span></div>",
                "</div>",
                "<div class='overlay'>",
                    "<div class='label'>"+title+"</div>",
                "</div>",
                "<img src='"+url+"'/>",
            "</div>"
        ].join('\n');
    end
end

