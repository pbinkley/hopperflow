class Directory < ActiveRecord::Base
  has_many :images, dependent: :destroy
  validates :dirpath, presence: true
  validate :directory_must_exist
  
  def directory_must_exist
  	unless dirpath.nil?
	  	unless Pathname(dirpath).exist?
    	  errors.add(:dirpath, ' does not exist')
	    end
	end
  end
end

