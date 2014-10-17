class Image < ActiveRecord::Base
  belongs_to :directory
      
  def thumb_path()
    "/thumbs/#{id}.thumb.gif"
  end

  def display_path()
	"/displays/#{id}.display.jpg"
  end
end
