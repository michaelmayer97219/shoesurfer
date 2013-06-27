class HomeController < ApplicationController
  def index

		@obj = genArrayOfSimilarities('B00BXEWSVQ') 
  end

end
