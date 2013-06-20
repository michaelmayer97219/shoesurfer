class HomeController < ApplicationController
  def index

		require 'yaml'
		require 'vacuum'
		req = Vacuum.new
		##req.configure(YAML.load_file('amazon.yml'))

		req.configure(key:    'AKIAIDF25W65W3YRQXTQ',
		              secret: '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',
		              tag:    'pershofin-20')

		scopes = %w(
		  AlternateVersions Images ItemAttributes SalesRank Similarities
		).join ','

		params = {
		  'Operation'     => 'ItemLookup',
		  'IdType'        => 'ASIN',
		  'ResponseGroup' => scopes,
		  'ItemId'        => '0679753354,039473954X'
		}

		@res = req.get(query: params)
		return @res.inspect
  end
  
end
