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

		xml.xpath("//title").each do |title| 
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

