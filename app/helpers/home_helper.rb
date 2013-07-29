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
		  'Availability'  => 'Available',
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes, Similarities', 
		  'ItemId'        => asin}  
		result = newVacuum(params)
		return nokogiri(result)
	end

	def cartCreate(asin) 
		params = {  
		  'Operation'     => 'CartCreate',  
		  'Item.1.ASIN'   => asin, 
		  'Item.1.Quantity' => 1,
		  'ResponseGroup' => 'Cart', 
		}  
		result = newVacuum(params)
		return nokogiri(result)
	end

	def cartSim(isNotFirst, asin)
		dependencies
		if isNotFirst == 0
			result = [cartCreate(asin).inner_text]
		end

		return result
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

	def termSearch(index, terms, page)
		params = {  
		  'Operation'     => 'ItemSearch',
		  'SearchIndex'   => index,
		  'Keywords'    =>  terms,
		  'ItemPage'      => page,
		  'Availability'  => 'Available',
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes, Similarities'}  
		result = newVacuum(params)
		return nokogiri(result)
	end

	def handleCall (tempThing)
		asins = []
		itemShort = []
		itemLong = [] 
		pages = []
	  	thing = []
	  	@prices = []
	  	alts = []
	  	blah = 0
	  	xx = 1

  		tempThing.xpath("//FormattedPrice").each do |price|
			@prices.push(price.inner_text)
		end

		tempThing.xpath("//Studio").each do |short|
			itemShort.push(short.inner_text)
		end

		tempThing.xpath("//ItemAttributes/Title").each do |long|
			itemLong.push(long.inner_text)
		end

  		tempThing.xpath("//Item/ASIN").each do |asin|
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

	def productsByTerms(index, terms, page) 

		dependencies

  		tempThing = termSearch(index, terms, page)		

  		return handleCall(tempThing)
  		
	end

	def fromIdToNodeResults(asin)
		@result = []
		dependencies
		params = {  
		  'Operation'     => 'ItemLookup',
		  'ItemId'    =>  asin,
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes, Similarities, BrowseNodes'}  
		result = newVacuum(params)
		nokogiri(result).xpath("//BrowseNodeId").each do |res|
			@result.push(res.inner_text)
		end
		return productsByNode(@result[0], 1, 2000, 50000)
	end

	def productsByNode(node, page, minPrice, maxPrice)
		dependencies
  		tempThing = searchByNode(node, page, minPrice, maxPrice)	
  		return handleCall(tempThing)
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
  		tempThing = simLookup(asin)	

	  return handleCall(tempThing)
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



end

