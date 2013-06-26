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
		  'ResponseGroup' => 'Images, ItemIds, Item Attributes, Similarities', 
		  'ItemId'        => asin}  
		result = newVacuum(params)
		return nokogiri(result)
	end

	def returnInfo(xml) 
		items = Hash.new
		xml.each do |obj| 
			hash = Hash.new

			obj.xpath("//ASIN").each do |asin| 
				key = asin
			end 

			obj.xpath("//DetailPageURL").each do |page| 
				pg = page.inner_text
			end 

			obj.xpath("//ImageSet[@Category='primary']/LargeImage/URL").each do |url| 
				im = url.inner_text
			end 

			obj.xpath("//Studio").each do |studio| 
				st = studio.inner_text
			end 

			obj.xpath("//title").each do |title| 
				tit = title.inner_text
			end 

			obj.xpath("//FormattedPrice").each do |price| 
				pr = price.inner_text
			end 
			items[key] = {
				'price' => pr,
				'page' => pg,
				'image' => im,
				'studio' => st,
				'title' => tit,
			}
		end
		return items
	end

end

