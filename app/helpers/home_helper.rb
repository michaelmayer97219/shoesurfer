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

	def lookupByNode(node)
		params = {  
		  'Operation'     => 'ItemSearch',
		  'SearchIndex'   => 'apparel',
		  'BrowseNode'    =>  node,
		  'ResponseGroup' => 'Images, ItemIds,Item Attributes'}  
		result = newVacuum(params)
		return nokogiri(result)
	end

	def simLookup(asin)
		params = {  
		  'Operation'     => 'SimilarityLookup',  
		  'IdType'        => 'ASIN', 
		  'ResponseGroup' => 'Images, ItemIds, ItemAttributes, Similarities', 
		  'ItemId'        => asin}  
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

		xml.xpath("//ASIN").each do |as| 
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

		xml.xpath("//title").each do |title| 
			titles.push(title.inner_text)
		end 

		xml.xpath("//FormattedPrice").each do |price| 
			prices.push(price.inner_text)
		end 
		return items
	end

end

