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

end
